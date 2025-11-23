import Phaser from 'phaser';
import SaveManager from '../utils/SaveManager';
import { Translations } from '../utils/Translations';
import { levels } from '../levels';

export default class SettingsScene extends Phaser.Scene {
  constructor() {
    super('SettingsScene');
  }

  create() {
    const { width, height } = this.scale;
    this.lang = SaveManager.getLanguage();
    this.t = Translations[this.lang];
    this.debugMode = SaveManager.getDebugMode();

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x222222);

    // Title
    this.titleText = this.add.text(width / 2, 50, this.t.SETTINGS, {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);

    // --- Language ---
    this.add.text(width * 0.3, 150, this.t.LANGUAGE, { fontSize: '32px', fill: '#aaa' }).setOrigin(0, 0.5);
    this.langBtn = this.add.text(width * 0.7, 150, this.lang === 'en' ? 'English' : '日本語', {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#444',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.langBtn.on('pointerdown', () => {
      this.lang = this.lang === 'en' ? 'jp' : 'en';
      SaveManager.setLanguage(this.lang);
      this.refreshUI();
    });

    // --- Debug Mode ---
    this.add.text(width * 0.3, 250, this.t.DEBUG_MODE, { fontSize: '32px', fill: '#aaa' }).setOrigin(0, 0.5);
    this.debugBtn = this.add.text(width * 0.7, 250, this.debugMode ? this.t.ON : this.t.OFF, {
      fontSize: '32px',
      fill: this.debugMode ? '#2ecc71' : '#e74c3c',
      backgroundColor: '#444',
      padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    this.debugBtn.on('pointerdown', () => {
      this.debugMode = !this.debugMode;
      SaveManager.setDebugMode(this.debugMode);
      this.refreshUI();
    });

    // --- Debug Level Toggles ---
    this.levelToggles = [];
    if (this.debugMode) {
        this.createLevelToggles(width, height);
    }

    // --- Back Button ---
    const backBtn = this.add.text(width / 2, height - 50, this.t.BACK, {
      fontSize: '32px',
      fill: '#fff',
      backgroundColor: '#666',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    backBtn.on('pointerdown', () => {
      this.scene.start('StageSelectScene');
    });
  }

  createLevelToggles(width, height) {
      const startY = 320;
      levels.forEach((level, index) => {
          const y = startY + index * 50;
          const isCleared = SaveManager.getLevelData(level.id).cleared;

          const label = this.add.text(width * 0.3, y, `Level ${level.id}: ${isCleared ? 'CLEARED' : '---'}`, {
              fontSize: '24px',
              fill: isCleared ? '#2ecc71' : '#888'
          }).setOrigin(0, 0.5);

          const toggle = this.add.rectangle(width * 0.7, y, 40, 40, isCleared ? 0x2ecc71 : 0x444)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

          toggle.on('pointerdown', () => {
              SaveManager.setLevelCleared(level.id, !isCleared);
              this.refreshUI();
          });

          this.levelToggles.push(label, toggle);
      });
  }

  refreshUI() {
      this.scene.restart();
  }
}
