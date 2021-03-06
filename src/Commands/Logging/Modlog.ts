import BaseCommand from '../../Utils/Structures/BaseCommand';
import DiscordClient from '../../Client/Client';
import { CommandInteraction, Message, Permissions } from 'discord.js';

export default class ModlogCommand extends BaseCommand {
	constructor() {
		super(
			'modlog',
			'logging',
			[],
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
			'working'
		);
	}
	async run(client: DiscordClient, message: Message, args: string[]) {
		if (
			!message.member.permissions.has([
				Permissions.FLAGS.MANAGE_GUILD || Permissions.FLAGS.ADMINISTRATOR,
			])
		) {
			const embed = await this.ErrorEmbed.UserPermissions({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				perms: ['MANAGE_GUILD', 'ADMINISTRATOR'],
			});

			const msg = await message.channel.send({ embeds: embed });
			return msg.delete({ timeout: 10000 });
		}

		const toConfigure = args[0];

		const modlog = await this.Channels.Modlog(message.guild.id, true);

		if (!toConfigure) {
			const embed = await this.Embed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				text: this,
				description: 'Modlog current settings',
				fields: [
					{
						name: 'Enabled?',
						value:
							modlog == null ? this.Emojis.off_switch : this.Emojis.on_switch,
					},
					{
						name: 'Value',
						value:
							modlog == null
								? '`N/A`'
								: (await this.Utils.FetchChannel(modlog)).toString(),
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
		}

		if (toConfigure.toLowerCase().includes('enable')) {
			const mention = message.mentions.channels.first();

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing the required mention!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			if (modlog != null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Mod-log is already enabled, use 'modlog update #mention' instead!",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.modlog = mention.id;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated modlog!```',
				fields: [
					{ name: 'Old value', value: '`Disabled`' },
					{
						name: 'New value',
						value: (await this.Utils.FetchChannel(mention.id)).toString(),
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (toConfigure.toLowerCase().includes('disable')) {
			if (modlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Mod-log is already disabled, use 'modlog enable #mention' to enable it!",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.modlog = null;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated mod-log```',
				fields: [
					{
						name: 'Old value',
						value: (await this.Utils.FetchChannel(modlog)).toString(),
					},
					{ name: 'New value', value: '`Disabled`' },
				],
			});

			return message.channel.send({ embeds: [embed] });
		}
		if (toConfigure.toLowerCase().includes('update')) {
			if (modlog == null) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message:
						"Mod-log is disabled! Use 'modlog enable #mention' to enable it!",
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}
			const mention = message.mentions.channels.first();

			if (!mention) {
				const embed = await this.ErrorEmbed.Base({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
					error_message: 'You are missing the required mention!',
				});

				const msg = await message.channel.send({ embeds: [embed] });
				return this.Utils.Delete(msg);
			}

			const con = await this.con.connect();

			try {
				const res = await con.query(
					`SELECT logging FROM Guilds WHERE guildid = '${message.guild.id}'`
				);
				if (res.rows.length == 0) return;
				const { data } = new this.Schemas.Logging(res.rows[0].logging);

				data.modlog = mention.id;

				const newData = new this.Schemas.Logging(data).toString();

				await con.query(`BEGIN`);
				await con.query(
					`UPDATE Guilds SET Logging = '${newData}' WHERE guildid = '${message.guild.id}'`
				);
				await con.query(`COMMIT`);
			} catch (error) {
				if (typeof error == 'object') return;
				console.log(error);

				const embed = await this.ErrorEmbed.UnexpectedError({
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
					id: message.guild.id,
					text: this,
				});

				return message.channel.send({ embeds: [embed] });
			} finally {
				con.release();
			}

			const embed = await this.SuccessEmbed.Base({
				iconURL: message.author.displayAvatarURL({ dynamic: true }),
				id: message.guild.id,
				text: this,
				success_message: '```Successfully updated mod-log```',
				fields: [
					{
						name: 'Old value',
						value: (await this.Utils.FetchChannel(modlog)).toString(),
					},
					{
						name: 'New value',
						value: (await this.Utils.FetchChannel(mention.id)).toString(),
					},
				],
			});

			return message.channel.send({ embeds: [embed] });
		}

		return await this.HelpEmbed.Base({
			iconURL: message.author.displayAvatarURL({ dynamic: true }),
			accessor: message,
			command: this,
		});
	}
	async slash(client: DiscordClient, interaction: CommandInteraction) {}
}
