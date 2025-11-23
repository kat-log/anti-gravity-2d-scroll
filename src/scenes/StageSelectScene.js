
import Phaser from 'phaser';
import { levels } from '../levels';
import SaveManager from '../utils/SaveManager';
import { Translations } from '../utils/Translations';

export default class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  preload() {
    this.load.image('player', '/assets/player.svg');
    this.load.image('player2', '/assets/player2.svg');
    this.load.image('gear', '/assets/gear.svg');
    this.load.image('lock', '/assets/lock.svg');
  }

  create() {
    const { width, height } = this.scale;
    this.lang = SaveManager.getLanguage();
    this.t = Translations[this.lang];

    // Title
    const title = this.add.text(width / 2, 50, this.t.GAME_MENU, {
      fontSize: '48px',
      fill: '#fff',
      padding: { top: 10, bottom: 10 }
    }).setOrigin(0.5);

    // Settings Button
    const gearBtn = this.add.image(width - 50, 50, 'gear')
        .setInteractive({ useHandCursor: true })
        .setScale(0.8);

    gearBtn.on('pointerdown', () => {
        this.scene.start('SettingsScene');
    });

    // --- Left Column: Stage List ---
    const subTitle = this.add.text(width * 0.3, 120, this.t.SELECT_STAGE, {
        fontSize: '32px',
        fill: '#aaa',
        padding: { top: 10, bottom: 10 }
    }).setOrigin(0.5);

    // List Camera (Left side)
    this.listCamera = this.cameras.add(0, 150, width * 0.6, height - 150);
    this.listCamera.setBackgroundColor(0x000000);
    this.listCamera.scrollX = -20; // Offset to center content in half-width

    // Ensure title is NOT seen by list camera
    this.listCamera.ignore([title, subTitle, gearBtn]);

    this.buttons = [];
    this.currentSelection = 0;
    this.activeColumn = 0; // 0: Stage, 1: Character

    levels.forEach((level, index) => {
      const y = 50 + index * 100;

      const buttonX = width * 0.3;

      const button = this.add.rectangle(buttonX, y, 350, 80, 0x6666ff)
        .setInteractive({ useHandCursor: true });

      const progress = SaveManager.getLevelData(level.id);
      const clearedMark = progress.cleared ? this.t.CLEARED : '';
      const highScoreText = progress.cleared ? `${this.t.HIGH_SCORE}${progress.highScore}` : this.t.NOT_CLEARED;

      const text = this.add.text(buttonX, y - 10, clearedMark + level.name, {
        fontSize: '24px',
        fill: '#fff',
        padding: { top: 5, bottom: 5 }
      }).setOrigin(0.5);

      const subText = this.add.text(buttonX, y + 20, highScoreText, {
        fontSize: '16px',
        fill: '#ddd',
        padding: { top: 5, bottom: 5 }
      }).setOrigin(0.5);

      this.cameras.main.ignore([button, text, subText]);

      button.setData('index', index);
      button.setData('text', text);
      button.setData('subText', subText);
      this.buttons.push(button);

      button.on('pointerdown', () => {
          this.activeColumn = 0;
          this.currentSelection = index;
          this.confirmSelection();
      });
    });

    // --- Right Column: Character Select ---
    this.characterType = SaveManager.getCharacter();

    // Check Unlock
    const l1 = SaveManager.getLevelData(1).cleared;
    const l2 = SaveManager.getLevelData(2).cleared;
    const l3 = SaveManager.getLevelData(3).cleared;
    this.ninjaUnlocked = l1 && l2 && l3;

    // We allow selecting Ninja even if locked now, so no auto-revert here.

    const rightX = width * 0.8;
    const charTitle = this.add.text(rightX, 120, this.t.CHARACTER, {
        fontSize: '32px',
        fill: '#aaa',
        padding: { top: 10, bottom: 10 }
    }).setOrigin(0.5);

    // Character Box
    this.charBox = this.add.rectangle(rightX, 250, 300, 200, 0x333333).setStrokeStyle(2, 0x666666);
    this.charName = this.add.text(rightX, 320, '', {
        fontSize: '28px',
        fill: '#fff',
        padding: { top: 10, bottom: 10 }
    }).setOrigin(0.5);
    this.charIcon = this.add.image(rightX, 240, 'player').setScale(3);

    // Always show Change text now
    const unlockText = this.add.text(rightX, 380, this.t.CHANGE, {
        fontSize: '16px',
        fill: '#888',
        padding: { top: 5, bottom: 5 }
    }).setOrigin(0.5);

    this.charDesc = this.add.text(rightX, 430, '', {
        fontSize: '16px',
        fill: '#aaa',
        align: 'center',
        padding: { top: 5, bottom: 5 }
    }).setOrigin(0.5);

    this.listCamera.ignore([this.charBox, this.charName, this.charIcon, charTitle, unlockText, this.charDesc]);

    // --- Input Handling ---
    this.input.keyboard.on('keydown-UP', () => {
        if (this.activeColumn === 0) {
            this.currentSelection--;
            if (this.currentSelection < 0) this.currentSelection = levels.length - 1;
        } else if (this.activeColumn === 1) { // Removed && this.ninjaUnlocked
            this.toggleCharacter();
        }
        this.updateSelection();
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        if (this.activeColumn === 0) {
            this.currentSelection++;
            if (this.currentSelection >= levels.length) this.currentSelection = 0;
        } else if (this.activeColumn === 1) { // Removed && this.ninjaUnlocked
            this.toggleCharacter();
        }
        this.updateSelection();
    });

    this.input.keyboard.on('keydown-LEFT', () => {
        this.activeColumn = 0;
        this.updateSelection();
    });

    this.input.keyboard.on('keydown-RIGHT', () => {
        this.activeColumn = 1;
        this.updateSelection();
    });

    this.input.keyboard.on('keydown-ENTER', () => this.confirmSelection());
    this.input.keyboard.on('keydown-SPACE', () => this.confirmSelection());

    // Mouse Wheel
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
        this.listCamera.scrollY += deltaY;
        this.listCamera.scrollY = Phaser.Math.Clamp(this.listCamera.scrollY, 0, levels.length * 100 - 200);
    });

    // Initial highlight
    this.updateCharacterDisplay();
    this.updateSelection();
  }

  toggleCharacter() {
      this.characterType = this.characterType === 'standard' ? 'ninja' : 'standard';
      SaveManager.saveCharacter(this.characterType);
      this.updateCharacterDisplay();
  }

  updateCharacterDisplay() {
      if (this.characterType === 'ninja') {
          if (this.ninjaUnlocked) {
              this.charName.setText(this.t.NINJA_NAME);
              this.charName.setColor('#2ecc71');
              this.charIcon.setTexture('player2');
              this.charDesc.setText(this.t.NINJA_DESC);
          } else {
              this.charName.setText('LOCKED');
              this.charName.setColor('#888');
              this.charIcon.setTexture('lock');
              this.charDesc.setText(this.t.UNLOCK_HINT);
          }
      } else {
          this.charName.setText(this.t.STANDARD_NAME);
          this.charName.setColor('#fff');
          this.charIcon.setTexture('player');
          this.charDesc.setText(this.t.STANDARD_DESC);
      }
  }

  updateSelection() {
    // Update Stage List
    this.buttons.forEach((button, index) => {
      const text = button.getData('text');
      const subText = button.getData('subText');

      const isSelected = (index === this.currentSelection);
      const isColumnActive = (this.activeColumn === 0);

      if (isSelected) {
        button.setFillStyle(isColumnActive ? 0x8888ff : 0x444488); // Bright if active, Dim if inactive
        button.setScale(1.05);
        if (text) text.setScale(1.05);
        if (subText) subText.setScale(1.05);

        // Auto-scroll
        const viewportHeight = this.scale.height - 150;
        const targetY = button.y - viewportHeight / 2;
        this.listCamera.scrollY = Phaser.Math.Clamp(targetY, 0, Math.max(0, levels.length * 100 - viewportHeight + 50));
      } else {
        button.setFillStyle(0x6666ff);
        button.setScale(1);
        if (text) text.setScale(1);
        if (subText) subText.setScale(1);
      }
    });

    // Update Character Box
    if (this.activeColumn === 1) {
        this.charBox.setStrokeStyle(4, 0xffff00); // Highlight
    } else {
        this.charBox.setStrokeStyle(2, 0x666666);
    }
  }

  confirmSelection() {
      if (this.activeColumn === 0) {
        // Prevent starting if locked character is selected
        if (this.characterType === 'ninja' && !this.ninjaUnlocked) {
            // Shake effect or visual feedback could go here
            this.cameras.main.shake(200, 0.01);
            return;
        }

        this.scene.start('GameScene', {
            levelIndex: this.currentSelection,
            characterType: this.characterType
        });
      }
  }
}
