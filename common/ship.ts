import { IControls } from '.';
import { IState } from './state';

export class Ship {
	public x: number;
	public y: number;
	public rot: number;

	constructor(
		private id: string,
		private state: IState,
		x?: number,
		y?: number,
		rot?: number
	) {
		this.x = x || 0;
		this.y = y || 0;
		this.rot = rot || 0;
	}

	public copyState() {
		this.state.entities[this.id].x = this.x;
		this.state.entities[this.id].y = this.y;
		this.state.entities[this.id].rot = this.rot;
	}

	private getControls(): IControls | undefined {
		const controllerId = this.state.entities[this.id].controller;

		if (controllerId) {
			const player = this.state.players[controllerId];

			if (player) {
				return player.controls;
			}
		}
	}

	public tick(delta: number, overrideControls?: IControls) {
		const controls = overrideControls || this.getControls();

		if (!controls) {
			return;
		}

		const difX = controls.mouseX - this.x;
		const difY = controls.mouseY - this.y;

		const rot = Math.atan2(difY, difX);

		this.rot = rot - 1.5708;

		if (controls.forward) {
			const normalizedDiff = Math.sqrt(difX * difX + difY * difY);
			const headingX = difX / normalizedDiff;
			const headingY = difY / normalizedDiff;

			this.x += headingX * 300 * (delta / 1000);
			this.y += headingY * 300 * (delta / 1000);
		}
	}
}
