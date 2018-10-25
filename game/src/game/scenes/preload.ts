import * as Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  private BAR_HEIGHT = 50;

  private bar: any;

  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Load assets
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('ship', 'assets/PNG/Default size/Ships/ship (5).png');
    this.load.tilemapTiledJSON('map', 'assets/maps/test.json');
    this.load.image('tiles', 'assets/tile_sheet.png');

    // Display loading progress
    const gameConfig = this.sys.game.config;
    const width = 800;
    this.bar = this.add.graphics({ x: 800 / 2 - width / 2, y: 600 / 2 });
    this.bar.fillStyle(0xaeaeae, 1);
    this.bar.fillRect(0, -(this.BAR_HEIGHT / 2), width, this.BAR_HEIGHT);

    this.load.on('progress', this.updateProgressDisplay, this);
  }

  create() {
    this.load.off('progress', this.updateProgressDisplay, this, true);

    this.tweens.add({
      targets: this.bar,
      scaleY: 0,
      duration: 1000,
      ease: 'EaseQuadOut',
      onComplete: () => {
        this.scene.switch('TitleScene');
      },
      callbackScope: this,
    });
  }

  updateProgressDisplay(pct) {
    this.bar
      .clear()
      .fillStyle(0x50576b, 1)
      .fillRect(0, -(this.BAR_HEIGHT / 2), this.sys.game.config.width, this.BAR_HEIGHT)
      .fillStyle(0xffffff, 1)
      .fillRect(0, -(this.BAR_HEIGHT / 2), Math.round((this.sys.game.config.width as number) * pct), this.BAR_HEIGHT);
  }
}
