import Phaser from 'phaser';
import SoundManager from '../utils/SoundManager';
import { levels } from '../levels';
import SaveManager from '../utils/SaveManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0;
    this.scoreText = null;
    this.soundManager = new SoundManager();
    this.levelData = null;
  }

  init(data) {
    // Load level data based on index passed from StageSelectScene
    // Default to Level 1 (index 0) if no data passed
    const index = data.levelIndex !== undefined ? data.levelIndex : 0;
    this.levelData = levels[index];
    this.characterType = data.characterType || 'standard';
  }

  preload() {
    this.load.image('player', '/assets/player.svg');
    this.load.image('player2', '/assets/player2.svg');
    this.load.image('ground', '/assets/ground.svg');
    this.load.image('enemy', '/assets/enemy.svg');
    this.load.image('bat', '/assets/bat.svg');
    this.load.image('star', '/assets/star.svg');
    this.load.image('goal', '/assets/goal.svg');
  }

  create() {
    // Initialize Sound Manager on first interaction
    this.input.on('pointerdown', () => this.soundManager.init());
    this.input.keyboard.on('keydown', () => this.soundManager.init());

    if (!this.levelData) return;

    // --- World & Camera Setup ---
    // --- World & Camera Setup ---
    this.physics.world.setBounds(0, 0, this.levelData.width, this.levelData.height);
    this.physics.world.setBoundsCollision(true, true, true, false); // Allow falling through bottom
    this.cameras.main.setBounds(0, 0, this.levelData.width, this.levelData.height);

    // --- Level Setup ---
    // Ground
    // Use tileSprite for repeating ground texture across the whole world
    let ground;
    if (this.levelData.hasGround !== false) {
        ground = this.add.tileSprite(
          this.levelData.width / 2,
          580,
          this.levelData.width,
          40,
          'ground'
        );
        this.physics.add.existing(ground, true);
    }

    // Platforms
    this.platforms = this.physics.add.staticGroup();

    this.levelData.platforms.forEach(p => {
      const platform = this.add.tileSprite(p.x, p.y, p.w, p.h, 'ground');
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
    });

    // --- Player ---
    const playerKey = this.characterType === 'ninja' ? 'player2' : 'player';
    this.player = this.physics.add.sprite(
      this.levelData.playerStart.x,
      this.levelData.playerStart.y,
      playerKey
    );
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(800);

    // Camera Follow
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // Jump Logic (Event-based for reliability)
    this.jumpCount = 0;
    this.input.keyboard.on('keydown-UP', () => {
        if (!this.player) return;

        const isNinja = this.characterType === 'ninja';
        const jumpForce = isNinja ? -400 : -600;
        const onGround = this.player.body.touching.down;

        if (onGround) {
            this.player.setVelocityY(jumpForce);
            this.jumpCount = 1;
            this.soundManager.playJump();
        } else if (isNinja && this.jumpCount < 2) {
            this.player.setVelocityY(jumpForce);
            this.jumpCount++;
            this.soundManager.playJump();
        }
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    // Return to Menu
    this.input.keyboard.on('keydown-ESC', () => {
        this.scene.start('StageSelectScene');
    });

    // --- Collectibles (Stars) ---
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 0
    });

    this.levelData.stars.forEach(pos => {
      const star = this.physics.add.sprite(pos.x, pos.y, 'star');
      star.body.setAllowGravity(false);
      this.stars.add(star);
    });

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // --- Enemies ---
    this.enemies = this.physics.add.group();

    this.levelData.enemies.forEach(enemyData => {
        const type = enemyData.type || 'ground';
        const key = type === 'flying' ? 'bat' : 'enemy';

        const enemy = this.physics.add.sprite(enemyData.x, enemyData.y, key);
        enemy.setCollideWorldBounds(true);
        enemy.setBounce(1, 0);
        enemy.setFriction(0, 0);
        enemy.setData('originX', enemyData.x);
        enemy.setData('type', type);

        if (type === 'flying') {
            enemy.body.setAllowGravity(false); // No gravity for bats
            enemy.setVelocityX(100);
        } else {
            enemy.setGravityY(800);
            enemy.setVelocityX(150);
        }

        this.enemies.add(enemy);
    });

    // --- Collisions ---
    this.physics.add.collider(this.player, this.platforms);
    if (ground) {
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemies, ground);
    }
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

    // --- Goal ---
    this.goal = this.physics.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.goal.body.setAllowGravity(false);
    this.goal.setImmovable(true);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    // --- UI ---
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    this.scoreText.setScrollFactor(0); // Fix to screen

    this.statusText = this.add.text(400, 300, '', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.statusText.setScrollFactor(0); // Fix to screen

    // Level Name Display
    const levelText = this.add.text(400, 50, this.levelData.name, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    levelText.setScrollFactor(0);
    this.time.delayedCall(2000, () => levelText.destroy());
  }

  update() {
    if (!this.player) return;

    const speed = 250;
    const jumpForce = -600;

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    // Jump State Management
    if (this.player.body.touching.down && this.player.body.velocity.y >= 0) {
        this.jumpCount = 0;
    }

    // Enemy Logic: Patrol
    this.enemies.getChildren().forEach(enemy => {
        const originX = enemy.getData('originX');
        const type = enemy.getData('type');
        const range = 200; // Patrol range

        if (type === 'flying') {
            // Flying enemies just move back and forth
            if (enemy.x > originX + range) {
                enemy.setVelocityX(-100);
                enemy.setFlipX(false);
            } else if (enemy.x < originX - range) {
                enemy.setVelocityX(100);
                enemy.setFlipX(true);
            }

            // Kickstart if stopped
            if (enemy.body.velocity.x === 0) {
                 enemy.setVelocityX(100);
            }
        } else {
            // Ground enemies
            if (enemy.x > originX + range) {
                enemy.setVelocityX(-150);
            } else if (enemy.x < originX - range) {
                enemy.setVelocityX(150);
            }

            // Failsafe for ground enemies
            if (Math.abs(enemy.body.velocity.x) < 10) {
                const direction = Math.random() > 0.5 ? 1 : -1;
                enemy.setVelocityX(150 * direction);
            }
        }

        // Despawn if fell out of world (pits)
        if (enemy.y > 600) {
            enemy.destroy();
        }
    });

    // Player fell in pit
    if (this.player.y > 600) {
        this.hitEnemy(this.player, null); // Trigger game over
    }
  }

  collectStar(player, star) {
    star.destroy(); // Remove star
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    this.soundManager.playCollect();
  }

  hitEnemy(player, enemy) {
    this.physics.pause();
    player.setTint(0xff0000); // Tint red
    this.statusText.setText('GAME OVER');
    this.soundManager.playHit();

    // Simple Game Over: Restart scene after 1 second
    this.time.delayedCall(1000, () => {
      this.scene.restart();
    });
  }

  reachGoal(player, goal) {
    this.physics.pause();

    // Save Progress
    SaveManager.saveLevelProgress(this.levelData.id, this.score);

    this.statusText.setText('YOU WIN!\nPress SPACE for Menu');
    this.soundManager.playWin();

    this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('StageSelectScene');
    });
  }
}
