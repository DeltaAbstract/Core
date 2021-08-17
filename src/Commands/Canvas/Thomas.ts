import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { AwaitMessagesOptions, Message, MessageAttachment } from 'discord.js';
import { Thomas } from 'discord-image-generation';

export default class ThomasCommand extends BaseCommand {
	constructor() {
		super(
			'thomas',
			'canvas',
			[],
			'',
			'',
			'',
			[],
			[],
			[],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		const guild = client.database.get(message.guild.id);

		const mention = message.mentions.members.first();

		const gEmbed = await this.GeneratingEmbed.DiscordIG({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		if (mention) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = mention.user.displayAvatarURL({ format: 'png' });
				const image = await new Thomas().getImage(avatar);
				const file = new MessageAttachment(image, 'thomas.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Thomas command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://thomas.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				console.log(error);

				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}

		if (args[0]) {
			if (args[0].toLowerCase().includes('help')) {
				return await this.HelpEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					command: this,
					message: message,
				});
			}
			if (args[0].toLowerCase().includes('me')) {
				const m = await message.channel.send({ embeds: [gEmbed] });

				try {
					const avatar = message.author.displayAvatarURL({ format: 'png' });
					const image = await new Thomas().getImage(avatar);
					const file = new MessageAttachment(image, 'thomas.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Thomas command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://thomas.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (error) {
					m.delete();

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embeds: [embed] });
				}
			}
		}

		if (message.attachments.size > 0) {
			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = message.attachments.first().url;
				const image = await new Thomas().getImage(avatar);
				const file = new MessageAttachment(image, 'thomas.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Thomas command',
					description: guild.Strings.DiscordIG,
					image: 'attachment://thomas.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (error) {
				m.delete();
				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		}

		let timedOut: boolean = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options: AwaitMessagesOptions = {
			filter: isFromAuthor,
			max: 1,
			time: 60000,
		};

		const tEmbed = await this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			title: 'Thomas command',
			description: `Please send the first image you want.`,
		});
		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			if (firstColl.first()?.content == 'cancel') {
				const embed = await this.SuccessEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					success_message: 'Successfully cancelled selection',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
			if (firstColl.first().attachments.size > 0) {
				const m = await message.channel.send({ embeds: [gEmbed] });

				try {
					const avatar = firstColl.first().attachments.first().url;
					const image = await new Thomas().getImage(avatar);
					const file = new MessageAttachment(image, 'thomas.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Thomas command',
						description: guild.Strings.DiscordIG,
						image: 'attachment://thomas.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (error) {}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut == true) {
			const embed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				error_message: 'Command timed out',
			});

			const msg = await message.channel.send({ embeds: [embed] });
			return this.Utils.Delete(msg);
		}
	}
}
