import Phaser from 'phaser';
import { levels } from '../levels';
import SaveManager from '../utils/SaveManager';

export default class StageSelectScene extends Phaser.Scene {
  constructor() {
    super('StageSelectScene');
  }

  preload() {
    this.load.image('player', '/assets/player.svg');
    this.load.image('player2', '/assets/player2.svg');
  }

  create() {
    const { width, height } = this.scale;

    // Title
    const title = this.add.text(width / 2, 50, 'GAME MENU', {
      fontSize: '48px',
      fill: '#fff'
    }).setOrigin(0.5);

    // --- Left Column: Stage List ---
    const subTitle = this.add.text(width * 0.3, 120, 'SELECT STAGE', { fontSize: '32px', fill: '#aaa' }).setOrigin(0.5);

    // List Camera (Left side)
    this.listCamera = this.cameras.add(0, 150, width * 0.6, height - 150);
    this.listCamera.setBackgroundColor(0x000000);
    this.listCamera.scrollX = -20; // Offset to center content in half-width

    // Ensure title is NOT seen by list camera
    this.listCamera.ignore([title, subTitle]);

    this.buttons = [];
    this.currentSelection = 0;
    this.activeColumn = 0; // 0: Stage, 1: Character

    levels.forEach((level, index) => {
      const y = 50 + index * 100;

      // Button centered in left column (width * 0.3)
      // But inside camera (width * 0.6), center is width * 0.3
      const buttonX = width * 0.3;

      const button = this.add.rectangle(buttonX, y, 350, 80, 0x6666ff)
        .setInteractive({ useHandCursor: true });

      const progress = SaveManager.getLevelData(level.id);
      const clearedMark = progress.cleared ? '★ ' : '';
      const highScoreText = progress.cleared ? `High Score: ${progress.highScore}` : 'Not Cleared';

      const text = this.add.text(buttonX, y - 10, clearedMark + level.name, {
        fontSize: '24px',
        fill: '#fff'
      }).setOrigin(0.5);

      const subText = this.add.text(buttonX, y + 20, highScoreText, {
        fontSize: '16px',
        fill: '#ddd'
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

    // If Ninja is selected but not unlocked (e.g. save data manipulation or reset), revert to standard
    if (this.characterType === 'ninja' && !this.ninjaUnlocked) {
        this.characterType = 'standard';
        SaveManager.saveCharacter('standard');
    }

    const rightX = width * 0.8;
    const charTitle = this.add.text(rightX, 120, 'CHARACTER', { fontSize: '32px', fill: '#aaa' }).setOrigin(0.5);

    // Character Box
    this.charBox = this.add.rectangle(rightX, 250, 300, 200, 0x333333).setStrokeStyle(2, 0x666666);
    this.charName = this.add.text(rightX, 320, 'STANDARD', { fontSize: '28px', fill: '#fff' }).setOrigin(0.5);
    this.charIcon = this.add.image(rightX, 240, 'player').setScale(3);

    const unlockText = this.ninjaUnlocked ?
        this.add.text(rightX, 380, '▲ ▼ Change', { fontSize: '16px', fill: '#888' }).setOrigin(0.5) :
        this.add.text(rightX, 380, 'Clear Lv1-3 to Unlock', { fontSize: '16px', fill: '#555' }).setOrigin(0.5);

    this.charDesc = this.add.text(rightX, 430, '', {
        fontSize: '16px',
        fill: '#aaa',
        align: 'center'
    }).setOrigin(0.5);

    this.listCamera.ignore([this.charBox, this.charName, this.charIcon, charTitle, unlockText, this.charDesc]);

    // --- Input Handling ---
    this.input.keyboard.on('keydown-UP', () => {
        if (this.activeColumn === 0) {
            this.currentSelection--;
            if (this.currentSelection < 0) this.currentSelection = levels.length - 1;
        } else if (this.activeColumn === 1 && this.ninjaUnlocked) {
            this.toggleCharacter();
        }
        this.updateSelection();
    });

    this.input.keyboard.on('keydown-DOWN', () => {
        if (this.activeColumn === 0) {
            this.currentSelection++;
            if (this.currentSelection >= levels.length) this.currentSelection = 0;
        } else if (this.activeColumn === 1 && this.ninjaUnlocked) {
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
          this.charName.setText('NINJA');
          this.charName.setColor('#2ecc71');
          this.charIcon.setTexture('player2');
          this.charDesc.setText('Low Jump Power\nDouble Jump Ability');
      } else {
          this.charName.setText('STANDARD');
          this.charName.setColor('#fff');
          this.charIcon.setTexture('player');
          this.charDesc.setText('High Jump Power\nSimple & Reliable');
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
        this.listCamera.scrollY = Phaser.Math.Clamp(targetY, 0, levels.length * 100 - 200);
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
        this.scene.start('GameScene', {
            levelIndex: this.currentSelection,
            characterType: this.characterType
        });
      }
  }
}
