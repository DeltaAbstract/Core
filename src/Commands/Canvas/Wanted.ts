import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	AwaitMessagesOptions,
	CommandInteraction,
	Message,
	MessageAttachment,
} from 'discord.js';
import { Wanted } from 'discord-image-generation';

export default class WantedCommand extends BaseCommand {
	constructor() {
		super(
			'wanted',
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
			text: this,
			id: message.guild.id,
		});

		if (mention) {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'You must specifiy a currency',
				});

				const msg = await message.channel.send({ embeds: errorEmbed });
				return msg.delete({ timeout: 10000 });
			}
			const avatar = message.mentions.members
				.first()
				.user.displayAvatarURL({ format: 'png' });

			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const image = await new Wanted().getImage(`${avatar}`, `${currency}`);
				const file = new MessageAttachment(image, 'wanted.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Wanted command',
					description: this.Utils.FormatProvider('Discord IG'),
					image: 'attachment://wanted.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (e) {
				m.delete();
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		} else if (args[0] == 'me') {
			const currency = args[1];

			if (!currency) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'You must specifiy a currency',
				});

				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}

			const m = await message.channel.send({ embeds: [gEmbed] });

			try {
				const avatar = message.author.displayAvatarURL({ format: 'png' });
				const image = await new Wanted().getImage(`${avatar}`, `${currency}`);
				const file = new MessageAttachment(image, 'wanted.png');

				const embed = await this.ImageEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					title: 'Wanted command',
					description: this.Utils.FormatProvider('Discord IG'),
					image: 'attachment://wanted.png',
				});

				m.delete();
				return message.channel.send({ files: [file], embeds: [embed] });
			} catch (e) {
				m.delete();
				console.log(e);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			}
		} else if (args[0] == 'help') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}
		let timedOut = false;

		const isFromAuthor = (m) => m.author.id == message.author.id;

		const options: AwaitMessagesOptions = {
			filter: isFromAuthor,
			max: 1,
			time: 60000,
		};

		const tEmbed = this.Embed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			text: this,
			description: 'Please sent the first image!',
		});
		await message.channel.send({ embeds: [tEmbed] });

		const firstColl = await message.channel.awaitMessages(options);

		if (firstColl.size > 0) {
			if (firstColl.first().attachments.size <= 0) {
				const errorEmbed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					text: this,
					id: message.guild.id,
					error_message: 'Must be an attachment!',
				});

				const msg = await message.channel.send({ embeds: [errorEmbed] });
				return this.Utils.Delete(msg);
			}
			const attach = firstColl.first().attachments.first().url;

			const dEmbed = this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Please mention a currency for the picture! "ex: $"',
			});

			await message.channel.send({ embeds: [dEmbed] });

			const secondColl = await message.channel.awaitMessages(options);

			if (secondColl.size > 0) {
				const attach2 = secondColl.first().content;

				const m = await message.channel.send({ embeds: [gEmbed] });
				try {
					const image = await new Wanted().getImage(`${attach}`, `${attach2}`);
					const file = new MessageAttachment(image, 'wanted.png');

					const embed = await this.ImageEmbed.Base({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						text: this,
						title: 'Wanted command',
						description: this.Utils.FormatProvider('Discord IG'),
						image: 'attachment://wanted.png',
					});

					m.delete();
					return message.channel.send({ files: [file], embeds: [embed] });
				} catch (e) {
					m.delete();
					console.log(e);

					const embed = await this.ErrorEmbed.UnexpectedError({
						iconURL: message.author.displayAvatarURL({ dynamic: true }),
						id: message.guild.id,
						text: this,
					});

					return message.channel.send({ embeds: [embed] });
				}
			} else timedOut = true;
		} else timedOut = true;

		if (timedOut === true) {
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
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
