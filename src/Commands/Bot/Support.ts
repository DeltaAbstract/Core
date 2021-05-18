import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class SupportCommand extends BaseCommand {
	constructor() {
		super('support', 'bot', []);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		// get my server invite link
	}
}
