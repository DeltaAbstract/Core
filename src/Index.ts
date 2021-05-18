import { registerCommands, registerEvents } from './Utils/Register';
import { Manager } from 'erela.js';
import * as dotenv from 'dotenv';
import DiscordClient from './Client/Client';
import { send } from 'process';
const client = new DiscordClient();

dotenv.config();

globalThis.client = client as DiscordClient;

client.manager = new Manager({
	nodes: [
		{
			port: parseInt(process.env.PORT),
			host: process.env.HOST,
			password: process.env.PASSWORD,
		},
	],
	send: (id, payload) => {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});

client.manager.on('nodeConnect', (node) => {
	console.log(`Node ${node.options.identifier} is online!`);
});

client.on('raw', (d) => client.manager.updateVoiceState(d));

(async () => {
	await registerCommands(client, '../Commands');
	await registerEvents(client, '../Events');
	await client.login(process.env.DISCORD_TOKEN);
})();
