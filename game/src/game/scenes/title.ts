import * as Phaser from 'phaser';
import * as Colyseus from 'colyseus.js';

export class TitleScene extends Phaser.Scene {
  private speed = 300;
  private magicNumber = 1.5708;

  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;

  private ship: Phaser.GameObjects.Image;

  private upKey: Phaser.Input.Keyboard.Key;
  private downKey: Phaser.Input.Keyboard.Key;
  private leftKey: Phaser.Input.Keyboard.Key;
  private rightKey: Phaser.Input.Keyboard.Key;

  private client: Colyseus.Client;

  constructor(test) {
    super({ key: 'TitleScene' });
  }

  private create() {
    this.client = new Colyseus.Client('ws://localhost:2657');
    const room = this.client.join('room');

    room.onJoin.addOnce(() => {
      console.log('JOINED ROOM');
    });

    console.log('ROOM STATE', room.state);

    room.listen('hello', (change) => {
      console.log(change);
    });

    room.listen('timer', (change) => {
      console.log(change);
    });

    this.client.onOpen.add(() => {
      console.log('CONNECTION ESTABLISHED');
    });

    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tmap', 'tiles');

    const baseLayer = this.map.createStaticLayer('Base', this.tileset, 0, 0);
    const islands = this.map.createStaticLayer('Islands', this.tileset, 0, 0);

    this.ship = this.add.image(<number>this.sys.game.config.width / 2, <number>this.sys.game.config.height / 2, 'ship');
    this.cameras.main.fadeIn(200);

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cameras.main.startFollow(this.ship);
    this.cameras.main.zoom = 0.7;
  }

  update(time, delta) {
    const mousePos = this.cameras.main.getWorldPoint(this.game.input.activePointer.x, this.game.input.activePointer.y);

    const difX = mousePos.x - this.ship.x;
    const difY = mousePos.y - this.ship.y;

    const rot = Math.atan2(difY, difX);

    this.ship.rotation = rot - this.magicNumber;

    const controls = this.getControls();

    const normalizedDiff = Math.sqrt(difX * difX + difY * difY);
    const headingX = difX / normalizedDiff;
    const headingY = difY / normalizedDiff;

    if (controls.up) {
      this.ship.x += headingX * this.speed * (delta / 1000);
      this.ship.y += headingY * this.speed * (delta / 1000);
    }

    if (controls.down) {
      this.ship.x -= headingX * this.speed * (delta / 1000);
      this.ship.y -= headingY * this.speed * (delta / 1000);
    }
  }

  getControls() {
    return {
      up: this.upKey.isDown,
      down: this.downKey.isDown,
      left: this.leftKey.isDown,
      right: this.rightKey.isDown,
    };
  }
}
