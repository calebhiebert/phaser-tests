import { IEntity, Ship } from '.';
import { IState, IControls } from './state';

export class Game {
	private _gameLoop: NodeJS.Timer;
	private _lastTick: number;

	private _ships: { [entid: string]: Ship };

	private _state: IState;

	constructor(state: IState) {
		this._state = state;
		this._lastTick = Date.now();
		this._gameLoop = setInterval(() => {
			let time = Date.now();
			this.update(time, time - this._lastTick);
			this._lastTick = time;
		}, 24);
		this._ships = {};
	}

	public addShip(ent: IEntity) {
		this._ships[ent.id] = new Ship(ent.id, this._state, ent.x, ent.y, ent.rot);
	}

	update(time: number, delta: number) {
		for (const shipId in this._ships) {
			const ship = this._ships[shipId];
			ship.tick(delta);
			ship.copyState();
		}
	}
}
