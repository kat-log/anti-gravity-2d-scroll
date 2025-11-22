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

    this.buttons = [];
    this.currentSelection = 0;

    levels.forEach((level, index) => {
      const y = 250 + index * 100;

      const button = this.add.rectangle(width / 2, y, 400, 60, 0x6666ff)
        .setInteractive({ useHandCursor: true });

      const text = this.add.text(width / 2, y, level.name, {
        fontSize: '32px',
        fill: '#fff'
      }).setOrigin(0.5);

      // Store button data for updates
      button.setData('index', index);
      this.buttons.push(button);

      // Mouse interactions
      button.on('pointerover', () => {
        this.currentSelection = index;
        this.updateSelection();
      });

      button.on('pointerdown', () => {
        this.scene.start('GameScene', { levelIndex: index });
      });
    });

    // Keyboard Input
    this.cursors = this.input.keyboard.createCursorKeys();
    this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    this.input.keyboard.on('keydown-UP', () => {
      this.currentSelection--;
      if (this.currentSelection < 0) this.currentSelection = levels.length - 1;
      this.updateSelection();
    });

    this.input.keyboard.on('keydown-DOWN', () => {
      this.currentSelection++;
      if (this.currentSelection >= levels.length) this.currentSelection = 0;
      this.updateSelection();
    });

    this.input.keyboard.on('keydown-SPACE', () => this.confirmSelection());
    this.input.keyboard.on('keydown-ENTER', () => this.confirmSelection());

    // Initial highlight
    this.updateSelection();
  }

  updateSelection() {
    this.buttons.forEach((button, index) => {
      if (index === this.currentSelection) {
        button.setFillStyle(0x8888ff); // Highlight
        button.setScale(1.05);
      } else {
        button.setFillStyle(0x6666ff); // Normal
        button.setScale(1);
      }
    });
  }

  confirmSelection() {
    this.scene.start('GameScene', { levelIndex: this.currentSelection });
  }
}
