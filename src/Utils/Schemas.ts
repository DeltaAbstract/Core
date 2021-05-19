import Types from './Structures/Interfaces/CachedGuild';

namespace Constructors {
	export class Welcome {
		data: Types.Welcome;
		constructor(data?: Types.Welcome | string) {
			if (!data) {
				this.data = {
					isEnabled: false,
					media: null,
					welcomeMessage: null,
					channelId: null,
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Leave {
		data: Types.Leave;
		constructor(data?: Types.Leave | string) {
			if (!data) {
				this.data = {
					isEnabled: false,
					media: null,
					leaveMessage: null,
					channelId: null,
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Roles {
		data: Types.Roles;
		constructor(data?: Types.Roles | string) {
			if (!data) {
				this.data = {
					modrole: null,
					warningrole: null,
					muterole: null,
					adminrole: null,
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Logging {
		data: Types.Channels;
		constructor(data?: Types.Channels | string) {
			if (!data) {
				this.data = {
					memberlog: null,
					modlog: null,
					rolelog: null,
					actionlog: null,
					appeals: null,
					reports: null,
					messagelog: null,
					emojilog: null,
					invitelog: null,
					publicmodlog: null,
					serverlog: null,
					suggestions: null,
					channellog: null,
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Blacklisted {
		data: Types.Blacklisted;
		constructor(data?: Types.Blacklisted | string) {
			if (!data) {
				this.data = {
					roles: [],
					users: [],
					channels: [],
				};
			}

			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Disabled {
		data: Types.Disabled;
		constructor(data?: Types.Disabled | string) {
			if (!data) {
				this.data = {
					commands: [],
					categories: [],
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Moderations {
		data: Types.Moderations;
		constructor(data?: Types.Moderations | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Protected {
		data: Types.Protected;
		constructor(data?: Types.Protected | string) {
			if (!data) {
				this.data = {
					users: [],
					roles: [],
				};
			}
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
	export class Tags {
		data: Types.Tags;
		constructor(data?: Types.Tags | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			console.log(this.data);
			return JSON.stringify(this.data);
		}
	}
	export class Ranks {
		public data: Types.Ranks;
		constructor(data?: Types.Ranks | string) {
			if (!data) this.data = [];
			if (typeof data == 'string') this.data = JSON.parse(data);
			else this.data = data;
		}
		toString() {
			return JSON.stringify(this.data);
		}
	}
}

export = Constructors;