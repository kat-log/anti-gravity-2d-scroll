import Phaser from 'phaser';
import { levels } from '../levels';
import SaveManager from '../utils/SaveManager';

export default class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  create() {
    const { width, height } = this.scale;

    // Title
    const title = this.add.text(width / 2, 80, 'SELECT STAGE', {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);

    // Camera Setup
    // Main camera handles background and title
    // List camera handles the scrolling buttons
    this.listCamera = this.cameras.add(0, 150, width, height - 150);
    this.listCamera.setBackgroundColor(0x000000); // Optional, or transparent

    // Ensure title is NOT seen by list camera
    this.listCamera.ignore(title);

    this.buttons = [];
    this.currentSelection = 0;

    levels.forEach((level, index) => {
      // Y position relative to the top of the list camera
      const y = 50 + index * 100;

      const button = this.add.rectangle(width / 2, y, 400, 80, 0x6666ff)
        .setInteractive({ useHandCursor: true });

      // Get Progress
      const progress = SaveManager.getLevelData(level.id);
      const clearedMark = progress.cleared ? '★ ' : '';
      const highScoreText = progress.cleared ? `High Score: ${progress.highScore}` : 'Not Cleared';

      const text = this.add.text(width / 2, y - 10, clearedMark + level.name, {
        fontSize: '28px',
        fill: '#fff'
      }).setOrigin(0.5);

      const subText = this.add.text(width / 2, y + 20, highScoreText, {
        fontSize: '16px',
        fill: '#ddd'
      }).setOrigin(0.5);

      // Hide from main camera (so they don't overlap title)
      this.cameras.main.ignore([button, text, subText]);

      // Store button data for updates
      button.setData('index', index);
      this.buttons.push(button);

      // Store text reference for scaling/color if needed (optional)
      button.setData('text', text);
      button.setData('subText', subText);

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

    // Mouse Wheel - Scroll List Camera
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        this.listCamera.scrollY += deltaY;
        this.listCamera.scrollY = Phaser.Math.Clamp(this.listCamera.scrollY, 0, levels.length * 100 - 200);
    });

    // Initial highlight
    this.updateSelection();
  }

  updateSelection() {
    this.buttons.forEach((button, index) => {
      const text = button.getData('text');
      const subText = button.getData('subText');

      if (index === this.currentSelection) {
        button.setFillStyle(0x8888ff); // Highlight
        button.setScale(1.05);
        if (text) text.setScale(1.05);
        if (subText) subText.setScale(1.05);

        // Auto-scroll to keep selection in view
        // Center the selected button in the list camera
        // Viewport height is (height - 150)
        const viewportHeight = this.scale.height - 150;
        const targetY = button.y - viewportHeight / 2;
        this.listCamera.scrollY = Phaser.Math.Clamp(targetY, 0, levels.length * 100 - 200);

      } else {
        button.setFillStyle(0x6666ff); // Normal
        button.setScale(1);
        if (text) text.setScale(1);
        if (subText) subText.setScale(1);
      }
    });
  }

  confirmSelection() {
    this.scene.start('GameScene', { levelIndex: this.currentSelection });
  }
}
