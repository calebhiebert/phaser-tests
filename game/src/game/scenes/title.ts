import * as Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import { IControls, IState, Message, IEntity } from '../../../../common';

export class TitleScene extends Phaser.Scene {
  private speed = 300;
  private magicNumber = 1.5708;

  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;

  private upKey: Phaser.Input.Keyboard.Key;

  private client: Colyseus.Client;
  private room: Colyseus.Room;
  private controls: IControls;

  private entities: { [id: string]: Phaser.GameObjects.Image };

  constructor(test) {
    super({ key: 'TitleScene' });

    this.controls = { forward: false, mouseX: 0, mouseY: 0 };
    this.entities = {};
  }

  private create() {
    this.client = new Colyseus.Client('ws://localhost:2657');
    this.room = this.client.join<IState>('game', {
      name: 'John',
    });

    this.room.onJoin.addOnce(() => {
      console.log('JOINED ROOM');
    });

    this.room.listen('events/:item', (change) => {
      if (change.operation === 'add') {
        console.log('EVENT', change.value.text);
      }
    });

    this.room.listen('entities/:idx/:prop', (change) => {
      console.log('ENTITY', change);
      const entity: IEntity = this.room.state.entities[change.path.idx];

      if (this.entities[entity.id] === undefined) {
        this.entities[entity.id] = this.add.image(entity.x, entity.y, 'ship');

        if (entity.controller === this.client.id) {
          this.cameras.main.startFollow(this.entities[entity.id]);
        }
      } else {
        this.entities[entity.id].x = entity.x;
        this.entities[entity.id].y = entity.y;
        this.entities[entity.id].rotation = entity.deg;
      }
    });

    this.client.onOpen.add(() => {
      console.log('CONNECTION ESTABLISHED');
    });

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tmap', 'tiles');

    const baseLayer = this.map.createStaticLayer('Base', this.tileset, 0, 0);
    const islands = this.map.createStaticLayer('Islands', this.tileset, 0, 0);

    this.cameras.main.fadeIn(200);

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    this.cameras.main.zoom = 0.7;
  }

  update(time, delta) {
    const shouldUpdateControls = this.updateControls();

    if (shouldUpdateControls && this.room.hasJoined) {
      this.room.send({
        type: Message.CONTROLS,
        data: this.controls,
      });
    }

    // const difX = this.controls.mouseX - this.ship.x;
    // const difY = this.controls.mouseY - this.ship.y;

    // const rot = Math.atan2(difY, difX);

    // this.ship.rotation = rot - this.magicNumber;

    // const normalizedDiff = Math.sqrt(difX * difX + difY * difY);
    // const headingX = difX / normalizedDiff;
    // const headingY = difY / normalizedDiff;

    if (this.controls.forward) {
      // this.ship.x += headingX * this.speed * (delta / 1000);
      // this.ship.y += headingY * this.speed * (delta / 1000);
    }
  }

  updateControls(): boolean {
    let shouldUpdate = false;

    const mousePos = this.cameras.main.getWorldPoint(
      this.game.input.activePointer.x,
      this.game.input.activePointer.y
    );

    if (this.controls.forward !== this.upKey.isDown) {
      shouldUpdate = true;
      this.controls.forward = this.upKey.isDown;
    }

    if (this.controls.mouseX !== mousePos.x) {
      shouldUpdate = true;
      this.controls.mouseX = mousePos.x;
    }

    if (this.controls.mouseY !== mousePos.y) {
      shouldUpdate = true;
      this.controls.mouseY = mousePos.y;
    }

    return shouldUpdate;
  }
}
