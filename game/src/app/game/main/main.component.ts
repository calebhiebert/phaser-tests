import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Phaser from 'phaser';
import { BootScene } from 'src/game/scenes/boot';
import { PreloaderScene } from 'src/game/scenes/preload';
import { TitleScene } from 'src/game/scenes/title';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements AfterViewInit {
  private game: Phaser.Game;

  @ViewChild('game')
  public canvas: ElementRef;

  constructor() {}

  ngAfterViewInit(): void {
    this.game = new Phaser.Game({
      type: Phaser.AUTO,
      canvas: this.canvas.nativeElement,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [BootScene, PreloaderScene, TitleScene],
    });

    this.resize();

    window.onresize = () => {
      this.resize();
    };
  }

  resize() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const windowRatio = windowWidth / windowHeight;
    const gameRatio = windowWidth / windowHeight;

    if (windowRatio < gameRatio) {
      this.canvas.nativeElement.style.width = windowWidth + 'px';
      this.canvas.nativeElement.style.height = windowWidth / gameRatio + 'px';
    } else {
      this.canvas.nativeElement.style.width = windowHeight * gameRatio + 'px';
      this.canvas.nativeElement.style.height = windowHeight + 'px';
    }
  }
}
