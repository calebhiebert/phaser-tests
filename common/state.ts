export interface IState {
	players: { [id: string]: IPlayer };
	entities: { [id: string]: IEntity };
	events: IEvent[];
}

export interface IEvent {
	text: string;
}

export interface IPlayer {
	id: string;
	name: string;
	present: boolean;
	controls: IControls;
}

export interface IControls {
	mouseX: number;
	mouseY: number;
	forward: boolean;
}

export interface IEntity {
	type: 'ship';
	controller?: string;
	id: string;
	x: number;
	y: number;
	rot: number;
}
