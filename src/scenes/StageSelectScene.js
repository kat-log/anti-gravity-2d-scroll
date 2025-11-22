import Phaser from 'phaser';
import { levels } from '../levels';

export default class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  create() {
    const { width, height } = this.scale;

    this.add.text(width / 2, 100, 'SELECT STAGE', {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);

    levels.forEach((level, index) => {
      const y = 250 + index * 100;

      const button = this.add.rectangle(width / 2, y, 400, 60, 0x6666ff)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(width / 2, y, level.name, {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);

      button.on('pointerover', () => button.setFillStyle(0x8888ff));
      button.on('pointerout', () => button.setFillStyle(0x6666ff));

      button.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: index });
      });
    });
  }
}
