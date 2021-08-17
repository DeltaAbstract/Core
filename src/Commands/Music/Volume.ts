import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class VolumeCommand extends BaseCommand {
	constructor() {
		super(
			'volume',
			'music',
			['vol'],
			'<new value>',
			'Set the music players volume',
			'',
			[],
			['volume 75', 'volume 100'],
			['SEND_MESSAGES', 'EMBED_LINKS', 'CONNECT'],
			['CONNECT'],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const player = client.manager.players.get(message.guild.id);
		if (!player) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				error_message: 'There is no music playing at the moment',
				id: message.guild.id,
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'You are not connected to the voice channel',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}

		if (voiceChannel.id !== player.options.voiceChannel) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You are not connected to the right channel',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}

		const volume = args[0];
		if (!volume) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'You must provide a number to set volume to',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}

		if (volume === 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				message: message,
			});
		}

		if (isNaN(parseInt(volume))) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Provided argument is not a number',
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		if (Number(volume) <= 0 || Number(volume) > 100) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Number must be from 1-100',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return this.Utils.Delete(msg);
		}
		try {
			player.setVolume(parseInt(volume));
		} catch (e) {
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
		const successEmbed = await this.SuccessEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			success_message: `Successfully set the volume to \`${volume}\``,
			text: this,
		});
		return message.channel.send({ embeds: [successEmbed] });
	}
}
