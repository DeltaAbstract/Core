import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Guild, Message } from 'discord.js';

export default class MessageUpdateEvent extends BaseEvent {
	constructor() {
		super('messageUpdate');
	}
	async run(client: DiscordClient, oldMessage: Message, newMessage: Message) {
		if (oldMessage.author.bot || newMessage.author.bot) return;

		const guild = newMessage.guild;
	}
}
