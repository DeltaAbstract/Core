import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Message } from 'discord.js';
import DiscordClient from '../../Client/Client';

export default class MessageEvent extends BaseEvent {
	constructor() {
		super('message');
	}

	async run(client: DiscordClient, message: Message) {
		if (message.author.bot) return;

		const prefix = ';;';

		if (message.content.startsWith(prefix)) {
			const [cmdName, ...cmdArgs] = message.content
				.slice(prefix.length)
				.trim()
				.split(/\s+/);
			const command = client.commands.get(cmdName);
			if (command) {
				command.run(client, message, cmdArgs);
			}
		}
	}
}