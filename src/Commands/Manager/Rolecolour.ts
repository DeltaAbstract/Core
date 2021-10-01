import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { Message } from 'discord.js';

export default class RolecolourCommand extends BaseCommand {
	constructor() {
		super(
			'rolecolor',
			'manager',
			['rolecolour'],
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
			'WIP'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {}
}