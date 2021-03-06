import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import {
	CommandInteraction,
	GuildMember,
	Interaction,
	Message,
} from 'discord.js';

export default class OTMemeCommand extends BaseCommand {
	constructor() {
		super(
			'otmeme',
			'memes',
			[],
			'',
			'Sends a meme from the OT trilogy',
			'',
			[],
			[],
			['SEND_MESSAGES', 'EMBED_LINKS'],
			[],
			true,
			false,
			false,
			3000,
			'working'
		);
	}
	async run(
		client: DiscordClient,
		message: Message,
		args: string[]
	): Promise<Message | void> {
		if (args[0]) {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}

		const gEmbed = await this.GeneratingEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
			provider: 'r/OTMemes',
		});

		const m = await message.channel.send({ embeds: [gEmbed] });

		try {
			const res = await this.Memes.OTmeme();

			if (res.error == true) {
				m.delete();

				const embed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: res.title,
				description: res.text,
				image: res.file,
				link: res.link,
				fields: [
					{ name: 'Upvotes:', value: res.misc.upvotes, inline: true },
					{ name: 'Downvotes:', value: res.misc.downvotes, inline: true },
					{ name: 'Posted at:', value: res.misc.postedAt },
				],
			});

			m.delete();
			return message.channel.send({ embeds: [embed] });
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
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const gEmbed = await this.GeneratingEmbed.Base({
			accessor: interaction,
			text: this,
			provider: 'r/OTMemes',
		});

		await interaction.reply({ embeds: [gEmbed] });

		try {
			const res = await this.Memes.OTmeme();

			if (res.error == true) {
				const embed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [embed] });
			}

			const embed = await this.ImageEmbed.Base({
				iconURL: this.Utils.GetIcon(interaction),
				text: this,
				title: res.title,
				description: res.text,
				image: res.file,
				link: res.link,
				fields: [
					{ name: 'Upvotes:', value: res.misc.upvotes, inline: true },
					{ name: 'Downvotes:', value: res.misc.downvotes, inline: true },
					{ name: 'Posted at:', value: res.misc.postedAt },
				],
			});

			return await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			// console.log(error);

			const embed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return await interaction.editReply({ embeds: [embed] });
		}
	}
}
