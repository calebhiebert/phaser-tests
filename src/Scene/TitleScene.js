export default class TitleScene extends Phaser.Scene {
  //=================================================================================================//
  constructor(test) {
    super({ key: 'TitleScene' });

    this.speed = 300;
    this.magicNumber = 1.5708;
  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });
    this.tileset = this.map.addTilesetImage('tmap', 'tiles');

    const baseLayer = this.map.createStaticLayer('Base', this.tileset, 0, 0);
    const islands = this.map.createStaticLayer('Islands', this.tileset, 0, 0);

    this.ship = this.add.image(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'ship');
    this.cameras.main.fadeIn(200);

    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    this.cameras.main.startFollow(this.ship);
    this.cameras.main.zoom = 0.7;
  }
  //=================================================================================================//

  update(time, delta) {
    let mousePos = this.cameras.main.getWorldPoint(this.game.input.activePointer.x, this.game.input.activePointer.y);

    let difX = mousePos.x - this.ship.x;
    let difY = mousePos.y - this.ship.y;

    let rot = Math.atan2(difY, difX);

    this.ship.rotation = rot - this.magicNumber;

    const controls = this.getControls();

    let normalizedDiff = Math.sqrt(difX * difX + difY * difY);
    let headingX = difX / normalizedDiff;
    let headingY = difY / normalizedDiff;

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
