import { Room, Presence, Client } from 'colyseus';
import { IState, Message, Game } from '../../common';
import { Logger } from 'pino';
import createLogger from './create-logger';
import nanoid = require('nanoid');

export class GameRoom extends Room<IState> {
	private logger: Logger;
	private game?: Game;

	constructor(presence?: Presence) {
		super(presence);
		this.logger = createLogger('test-room');
	}

	onInit(options: any) {
		this.setState({
			players: {},
			entities: {},
			events: [],
		});

		this.game = new Game(this.state);
	}

	onJoin(client: Client, options?: any, auth?: any) {
		this.state.players[client.id] = {
			id: client.id,
			name: options.name,
			present: true,
			controls: {
				mouseX: 0,
				mouseY: 0,
				forward: false,
			},
		};

		this.state.events.push({
			text: `${options.name} has joined the game`,
		});

		const id = nanoid(4);
		this.state.entities[id] = {
			type: 'ship',
			controller: client.id,
			x: 0,
			y: 0,
			rot: 0,
			id: id,
		};

		if (this.game) {
			this.game.addShip(this.state.entities[id]);
		}

		this.sendState(client);
	}

	onLeave(client: Client, consented: boolean) {
		this.state.players[client.id].present = false;

		this.state.events.push({
			text: `${this.state.players[client.id].name} has left the game`,
		});
	}

	onAuth(options: any) {
		return options.name !== undefined;
	}

	onMessage(client: Client, data: any): void {
		switch (data.type) {
			case Message.CONTROLS:
				this.state.players[client.id].controls = data.data;
				break;
		}
	}
}
