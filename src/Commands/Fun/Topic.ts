import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import fun from 'fun-responses';

export default class TopicCommand extends BaseCommand {
	constructor() {
		super(
			'topic',
			'fun',
			[],
			'',
			'',
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
		const lang = await this.Translator.Getlang(message.guild.id);
		const self = this;

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
			provider: 'Fun-responses',
		});

		const m = await message.channel.send({ embeds: [gEmbed] });

		try {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Fun-responses\``,
				fields: [{ name: 'Topic', value: `\`${await fun.topic()}\`` }],
			});

			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const lang = await this.Translator.Getlang(interaction.guild.id);

		const gEmbed = await this.GeneratingEmbed.Base({
			accessor: interaction,
			text: this,
			provider: 'Fun-responses',
		});

		await interaction.editReply({ embeds: [gEmbed] });

		try {
			const embed = await this.Embed.Base({
				accessor: interaction,
				text: this,
				description: `${this.Utils.Capitalize(
					this.Translator.Getstring(lang, 'provided_by')
				)}: \`Fun-responses\``,
				fields: [{ name: 'Topic', value: `\`${await fun.topic()}\`` }],
			});

			return await interaction.editReply({ embeds: [embed] });
		} catch (error) {
			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				accessor: interaction,
				text: this,
			});

			return interaction.editReply({ embeds: [errEmbed] });
		}
	}
}
