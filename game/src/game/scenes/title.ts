import * as Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';
import {
  IControls,
  IState,
  Message,
  IEntity,
  Ship,
  IPlayer,
} from '../../../../common';

export class TitleScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;

  private upKey: Phaser.Input.Keyboard.Key;

  private client: Colyseus.Client;
  private room: Colyseus.Room;
  private controls: IControls;

  private ships: {
    [entid: string]: {
      ship: Ship;
      go: Phaser.GameObjects.Image;
      uiContainer: Phaser.GameObjects.Container;
    };
  };

  constructor(test) {
    super({ key: 'TitleScene' });

    this.controls = { forward: false, mouseX: 0, mouseY: 0 };
    this.ships = {};
  }

  private create() {
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tmap', 'tiles');

    const baseLayer = this.map.createStaticLayer('Base', this.tileset, 0, 0);
    const islands = this.map.createStaticLayer('Islands', this.tileset, 0, 0);

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    // this.cameras.main.zoom = 0.7;

    this.roomSetup();
  }

  private roomSetup() {
    this.client = new Colyseus.Client('ws://localhost:2657');
    this.room = this.client.join<IState>('game', {
      name: 'John',
    });

    this.room.onJoin.addOnce(() => {
      console.log('JOINED ROOM');
    });

    // this.room.onStateChange.add((d) => {
    //   console.log('State Update', d);
    // });

    this.room.listen('events/:item', (change) => {
      if (change.operation === 'add') {
        console.log('EVENT', change.value.text);
      }
    });

    this.room.listen('entities/:idx/:attr', (change) => {
      const entity: IEntity = this.room.state.entities[change.path.idx];
      const player: IPlayer = this.room.state.players[entity.controller];

      if (this.ships[entity.id] === undefined) {
        const uiContainer = this.add.container(entity.x, entity.y);
        const text = this.add.text(0, -60, player.name, {
          fontSize: '32px',
          fontFamily: 'Noto Sans',
          stroke: '#000',
          strokeThickness: 3,
        });

        text.setAlign('center');

        uiContainer.add(text);

        this.ships[entity.id] = {
          ship: new Ship(
            entity.id,
            this.room.state,
            entity.x,
            entity.y,
            entity.rot
          ),
          go: this.add.image(entity.x, entity.y, 'ship'),
          uiContainer: uiContainer,
        };

        if (entity.controller === this.client.id) {
          this.cameras.main.startFollow(this.ships[entity.id].go);
        }
      } else {
        const ship = this.ships[entity.id];
        ship.go.x = ship.ship.x = ship.uiContainer.x = entity.x;
        ship.go.y = ship.ship.y = ship.uiContainer.y = entity.y;
        ship.go.rotation = ship.ship.rot = entity.rot;
      }
    });

    this.client.onOpen.add(() => {
      console.log('CONNECTION ESTABLISHED');
    });
  }

  update(time, delta) {
    const shouldUpdateControls = this.updateControls();

    if (shouldUpdateControls && this.room.hasJoined) {
      this.room.send({
        type: Message.CONTROLS,
        data: this.controls,
      });
    }

    for (const shipId in this.ships) {
      const ship = this.ships[shipId];

      if (this.room.state.entities[shipId].controller === this.client.id) {
        ship.ship.tick(delta, this.controls);
        ship.go.rotation = ship.ship.rot;
      } else {
        ship.ship.tick(delta);
      }

      ship.uiContainer.x = ship.ship.x;
      ship.uiContainer.y = ship.ship.y - 60;

      ship.go.x = ship.ship.x;
      ship.go.y = ship.ship.y;
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
