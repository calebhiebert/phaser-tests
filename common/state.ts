export interface IState {
	players: { [id: string]: IPlayer };
	events: IEvent[];
	entities: IEntity[];
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
	deg: number;
}
