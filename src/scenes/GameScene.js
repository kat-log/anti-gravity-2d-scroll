
import Phaser from 'phaser';
import SoundManager from '../utils/SoundManager';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.score = 0;
    this.scoreText = null;
    this.soundManager = new SoundManager();
  }

  preload() {
    this.load.image('player', '/assets/player.svg');
    this.load.image('ground', '/assets/ground.svg');
    this.load.image('enemy', '/assets/enemy.svg');
    this.load.image('star', '/assets/star.svg');
    this.load.image('goal', '/assets/goal.svg');
  }

  create() {
    // Initialize Sound Manager on first interaction
    this.input.on('pointerdown', () => this.soundManager.init());
    this.input.keyboard.on('keydown', () => this.soundManager.init());

    // --- World & Camera Setup ---
    this.physics.world.setBounds(0, 0, 2400, 600);
    this.cameras.main.setBounds(0, 0, 2400, 600);

    // --- Level Setup ---
    // Ground
    // Use tileSprite for repeating ground texture across the whole world
    const ground = this.add.tileSprite(1200, 580, 2400, 40, 'ground'); // Center x=1200, width=2400
    this.physics.add.existing(ground, true);

    // Platforms
    this.platforms = this.physics.add.staticGroup();

    // Extended Platform Positions
    const platformData = [
      // Screen 1 (0-800)
      { x: 600, y: 450, w: 200, h: 20 },
      { x: 200, y: 350, w: 200, h: 20 },

      // Screen 2 (800-1600)
      { x: 1000, y: 300, w: 200, h: 20 },
      { x: 1400, y: 400, w: 200, h: 20 },
      { x: 1200, y: 150, w: 150, h: 20 }, // High platform

      // Screen 3 (1600-2400)
      { x: 1800, y: 350, w: 200, h: 20 },
      { x: 2100, y: 250, w: 200, h: 20 },
      { x: 1700, y: 500, w: 100, h: 20 }  // Low platform
    ];

    platformData.forEach(p => {
      const platform = this.add.tileSprite(p.x, p.y, p.w, p.h, 'ground');
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
    });

    // --- Player ---
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(800);

    // Camera Follow
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // --- Collisions ---
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, this.platforms);

    // --- Input ---
    this.cursors = this.input.keyboard.createCursorKeys();

    // --- Collectibles (Stars) ---
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 0
    });

    const starPositions = [
      { x: 600, y: 400 },
      { x: 200, y: 300 },
      { x: 1000, y: 250 },
      { x: 1200, y: 100 },
      { x: 1400, y: 350 },
      { x: 1800, y: 300 },
      { x: 2100, y: 200 }
    ];

    starPositions.forEach(pos => {
      const star = this.physics.add.sprite(pos.x, pos.y, 'star');
      star.body.setAllowGravity(false);
      this.stars.add(star);
    });

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

    // --- Enemies ---
    this.enemies = this.physics.add.group();

    const enemyPositions = [
        { x: 400, y: 100 },
        { x: 1100, y: 100 },
        { x: 1500, y: 100 },
        { x: 1900, y: 100 }
    ];

    enemyPositions.forEach(pos => {
        const enemy = this.physics.add.sprite(pos.x, pos.y, 'enemy');
        enemy.setCollideWorldBounds(true);
        enemy.setGravityY(800);
        enemy.setVelocityX(150);
        enemy.setBounce(1, 0);
        enemy.setFriction(0, 0);
        // Store initial X for simple patrol logic
        enemy.setData('originX', pos.x);
        this.enemies.add(enemy);
    });

    this.physics.add.collider(this.enemies, ground);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

    // --- Goal ---
    this.goal = this.physics.add.sprite(2300, 100, 'goal'); // Moved to end
    this.goal.body.setAllowGravity(false);
    this.goal.setImmovable(true);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    // --- UI ---
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
    this.scoreText.setScrollFactor(0); // Fix to screen

    this.statusText = this.add.text(400, 300, '', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);
    this.statusText.setScrollFactor(0); // Fix to screen
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

    // Jump
    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(jumpForce);
      this.soundManager.playJump();
    }

    // Enemy Logic: Simple Patrol around origin
    this.enemies.getChildren().forEach(enemy => {
        const originX = enemy.getData('originX');
        const range = 200; // Patrol range

        if (enemy.x > originX + range) {
            enemy.setVelocityX(-150);
        } else if (enemy.x < originX - range) {
            enemy.setVelocityX(150);
        }

        // Failsafe
        if (Math.abs(enemy.body.velocity.x) < 10) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            enemy.setVelocityX(150 * direction);
        }
    });
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
    this.statusText.setText('YOU WIN!\nPress SPACE to Restart');
    this.soundManager.playWin();

    this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.restart();
    });
  }
}
