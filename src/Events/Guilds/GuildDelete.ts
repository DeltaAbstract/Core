import DiscordClient from '../../Client/Client';
import BaseEvent from '../../Utils/Structures/BaseEvent';
import { Guild } from 'discord.js';

export default class GuildDeleteEvent extends BaseEvent {
	constructor() {
		super('guildDelete');
	}
	async run(client: DiscordClient, guild: Guild) {
		const con = await this.con.connect();

		try {
		} catch (error) {
			await con.query(`BEGIN`);
			await con.query(
				`DELETE FROM GuildConfigurable WHERE guildId = '${guild.id}'`
			);
			await con.query(`DELETE FROM GuildLogging WHERE guildId = '${guild.id}'`);
			await con.query(
				`DELETE FROM welcomesystem WHERE guildId = '${guild.id}'`
			);
			await con.query(`DELETE FROM leavesystem WHERE guildId = '${guild.id}'`);
			await con.query(`DELETE FROM serverroles WHERE guildId = '${guild.id}'`);
			await con.query(`DELETE FROM guildstats WHERE guildId '${guild.id}'`);
			await con.query(`COMMIT`);
			console.log('Guild removed!');
		} finally {
			con.release();
		}
	}
}