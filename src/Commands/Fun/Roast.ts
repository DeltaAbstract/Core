import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message } from 'discord.js';
import fun from 'fun-responses';

export default class RoastCommand extends BaseCommand {
	constructor() {
		super(
			'roast',
			'fun',
			[],
			'',
			'Sends a roast 🔥',
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
				description: this.Utils.FormatProvider('Fun-Responses'),
				fields: [{ name: 'Roast', value: `"\`${await fun.roast()}\`"` }],
			});

			m.delete();
			return message.channel.send({ embeds: [embed] });
		} catch (e) {
			m.delete();
			console.log(e);

			const errEmbed = await this.ErrorEmbed.UnexpectedError({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
			});
			return message.channel.send({ embeds: [errEmbed] });
		}
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {
		const gEmbed = await this.GeneratingEmbed.Base({
			accessor: interaction,
			text: this,
			provider: 'Fun-responses',
		});

		await interaction.reply({ embeds: [gEmbed] });

		try {
			const embed = await this.Embed.Base({
				accessor: interaction,
				text: this,
				description: this.Utils.FormatProvider('Fun-Responses'),
				fields: [{ name: 'Roast', value: `"\`${await fun.roast()}\`"` }],
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
