import { IEntity } from '.';
import { IState, IControls } from './state';

export class Game {
	private _gameLoop: number;
	private _lastTick: number;

	private _state: IState;

	constructor(state: IState) {
		this._state = state;
		this._lastTick = Date.now();
		this._gameLoop = setInterval(() => {
			let time = Date.now();
			this.update(time, time - this._lastTick);
			this._lastTick = time;
		});
	}

	update(time: number, delta: number) {
		for (const ent of this._state.entities) {
			if (ent.controller !== undefined) {
				const controls = this._state.players[ent.controller].controls;
				this.moveEntityFromControls(ent, controls, delta);
			}
		}
	}

	private moveEntityFromControls(
		ent: IEntity,
		controls: IControls,
		delta: number
	) {
		const difX = controls.mouseX - ent.x;
		const difY = controls.mouseY - ent.y;

		const rot = Math.atan2(difY, difX);

		ent.deg = rot - 1.5708;

		if (controls.forward) {
			const normalizedDiff = Math.sqrt(difX * difX + difY * difY);
			const headingX = difX / normalizedDiff;
			const headingY = difY / normalizedDiff;

			ent.x += headingX * 300 * (delta / 1000);
			ent.y += headingY * 300 * (delta / 1000);
		}
	}
}
