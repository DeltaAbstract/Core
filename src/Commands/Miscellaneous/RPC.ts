import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { AwaitReactionsOptions, CommandInteraction, Message } from 'discord.js';
import axios from 'axios';

export default class RPCCommand extends BaseCommand {
	constructor() {
		super(
			'rpc',
			'miscellaneous',
			[],
			'<query>',
			'Search the Discord JS RPC client',
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
		const query = args[0];

		if (!query) {
			const errEmbed = await this.ErrorEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
				error_message: 'Missing query',
			});
			const msg = await message.channel.send({ embeds: [errEmbed] });
			return msg.delete({ timeout: 10000 });
		}
		const url = `https://djsdocs.sorta.moe/v2/embed?src=rpc&q=${encodeURIComponent(
			query
		)}`;

		const docFetch = await axios.get(url);
		/**
		 * @type {MessageEmbed}
		 */
		const embed = docFetch.data;

		if (!embed || embed.error) {
			const errorEmbed = await this.ErrorEmbed.NoResult({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				id: message.guild.id,
			});
			const msg = await message.channel.send({ embeds: [errorEmbed] });
			return this.Utils.Delete(msg);
		}

		if (!message.guild) {
			return message.channel.send({ embeds: [embed] });
		}

		const msg = await message.channel.send({ embeds: [embed] });
		msg.react('🗑️');

		let react;

		const options: AwaitReactionsOptions = {
			filter: (reaction, user) =>
				reaction.emoji.name === '🗑️' && user.id === message.author.id,
			max: 1,
			time: 60000,
			errors: ['time'],
		};

		try {
			react = await msg.awaitReactions(options);
		} catch (error) {
			msg.reactions.removeAll();
		}

		if (react && react.first()) msg.delete();
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
