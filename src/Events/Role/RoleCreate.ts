import BaseEvent from '../../Utils/Structures/BaseEvent';
import DiscordClient from '../../Client/Client';
import { Role } from 'discord.js';

export default class RoleCreateEvent extends BaseEvent {
	constructor() {
		super('roleCreate');
	}
	async run(client: DiscordClient, role: Role) {
		const guild = role.guild;
	}
}
