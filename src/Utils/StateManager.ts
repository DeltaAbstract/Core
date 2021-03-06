import { EventEmitter } from 'events';
import { Pool } from 'pg';

class StateManager extends EventEmitter {
	con: Pool;
	constructor(options?: object) {
		super(options);

		this.con = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: { rejectUnauthorized: false },
		});
	}
}

export = new StateManager();
