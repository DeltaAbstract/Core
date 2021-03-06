import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, GuildMember, Message } from 'discord.js';

export default class CuddleCommand extends BaseCommand {
	constructor() {
		super(
			'cuddle',
			'reaction images',
			[],
			'<mention>',
			'Cuddle the mentioned user',
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
	async run(client: DiscordClient, message: Message, args: string[]) {
		const mention = message.mentions.users.first();

		let user: GuildMember | string = args[0];

		if (message.mentions.members.size > 0) {
			user = message.mentions.members.first();
		}

		if (typeof user == 'string') {
			return await this.HelpEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				command: this,
				accessor: message,
			});
		}

		if (!user) {
			const errorEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing a required user mention',
			});

			return await message.reply({ embeds: [errorEmbed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			id: message.guild.id,
			text: this,
		});

		const m = await message.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Cuddle();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return await m.edit({ embeds: [errEmbed] });
			}

			const cuddleEmbed = await this.ImageEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				title: 'Cuddle command',
				description: `${message.author.toString()} has cuddled ${user.toString()}! Awww!`,
				image: res.file,
			});

			return await m.edit({ embeds: [cuddleEmbed] });
		} catch (e) {
			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});

			return await m.edit({ embeds: [errorEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const user = interaction.options.getUser('user');

		if (!user) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: this.Utils.GetIcon(interaction),
				text: this,
				id: this.Utils.GetGuildId(interaction),
				error_message: 'Missing required user mention',
			});

			return await interaction.reply({ embeds: [errEmbed] });
		}

		const generatingEmbed = await this.GeneratingEmbed.NekosFun({
			accessor: interaction,
			text: this,
		});

		await interaction.reply({ embeds: [generatingEmbed] });

		try {
			const res = await this.Reactions.Cuddle();

			if (res.error == true) {
				const errEmbed = await this.ErrorEmbed.ApiError({
					accessor: interaction,
					text: this,
				});

				return await interaction.editReply({ embeds: [errEmbed] });
			}

			const cuddleEmbed = await this.ImageEmbed.Base({
				accessor: interaction,
				text: this,
				title: 'Cuddle command',
				description: `${interaction.user.toString()} has cuddled ${user.toString()}! Awww!`,
				image: res.file,
			});

			return await interaction.editReply({ embeds: [cuddleEmbed] });
		} catch (error) {
			console.log('Error', error);

			const errorEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});
			return interaction.editReply({ embeds: [errorEmbed] });
		}
	}
}
