import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class PrefixCommand extends BaseCommand {
	constructor() {
		super('play', 'music', []);
	}
	async run(client, message, args) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You must be in a voice channel to use this command',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const permissions = voiceChannel.permissionsFor(client.user);
		if (!permissions.has('CONNECT')) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'I cannot connect to this channel',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}
		if (!permissions.has('SPEAK')) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'I cannot speak in this channel',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		const search = args.join(' ');

		if (!search) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Please specify a link or query',
			});
			const msg = await message.channel.send({ embed: errorEmbed });
			return msg.delete({ timeout: 10000 });
		}

		if (search == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		/**
		 * @type {Player}
		 */
		const player = client.manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
		});

		if (player.state !== 'CONNECTED') player.connect();

		const res = await client.manager.search(search, message.author);
		switch (res.loadType) {
			case 'TRACK_LOADED':
				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: `Added [${res.tracks[0].title}](${res.tracks[0].uri}) to the queue. Duration: `,
					image: res.tracks[0].thumbnail,
				});

				player.queue.add(res.tracks[0]);
				message.channel.send({ embed: embed });
				if (!player.playing) player.play();
				break;
			case 'SEARCH_RESULT':
				let index = 1;
				const tracks = res.tracks.slice(0, 5);

				const sembed = await this.Embed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'There are multiple results',
					description:
						'You have `30` seconds to pick from one of those. Say `cancel` if you want to cancel the selection',
					fields: [
						{
							name: 'Songs',
							value: `${tracks
								.map((video) => `**${index++} -** ${video.title}`)
								.join('\n')}`,
						},
					],
				});

				await message.channel.send({ embed: sembed });
				const collector = message.channel.createMessageCollector(
					(m) => {
						return (
							m.author.id === message.author.id &&
							new RegExp(`^([1-5]|cancel)$`, 'i').test(m.content)
						);
					},
					{ time: 30000, max: 1 }
				);

				collector.on('collect', async (m) => {
					if (/cancel/i.test(m.content)) return collector.stop('cancelled');

					/**
					 * @type {Track}
					 */
					const track = tracks[Number(m.content) - 1];
					player.queue.add(track);

					const tEmbed = await this.Embed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						description: `Added [${track.title}](${track.uri}) to the queue. | Duration: `,
						image: track.thumbnail,
						link: track.uri,
					});

					message.channel.send({ embed: tEmbed });
					if (!player.playing) player.play();
				});

				collector.on('end', async (_, reason) => {
					if (['time', 'cancelled'].includes(reason)) {
						const successEmbed = await this.SuccessEmbed.Base({
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
							id: message.guild.id,
							text: this,
							success_message: 'Successfully cancelled selection',
						});
						return message.channel.send({ embed: successEmbed });
					}
				});
				break;
			case 'PLAYLIST_LOADED':
				res.playlist.tracks.forEach((track) => player.queue.add(track));
				const playlistEmbed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: `Adding \`${res.playlist.tracks.length}\` tracks in playlist \`${res.playlist.info.name}\` to the queue`,
				});
				message.channel.send({ embed: playlistEmbed });
				if (!player.playing) player.play();
				break;
		}
	}
}