import Phaser from 'phaser';
import SoundManager from '../utils/SoundManager';
import { levels } from '../levels';
import SaveManager from '../utils/SaveManager';
import { Translations } from '../utils/Translations';

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

    this.lang = SaveManager.getLanguage();
    this.t = Translations[this.lang];
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
    this.cameras.main.setBackgroundColor(this.levelData.background || 0x000000);

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
    this.platforms = this.physics.add.staticGroup(); // Note: Static bodies don't move with physics, but we can move them manually/tween
    // Actually, for moving platforms, we need kinematic bodies or just update static body position?
    // Phaser Static bodies can be moved but don't carry the player automatically.
    // Let's use a separate group for moving platforms if needed, or just move these.
    // Arcade Physics "Static" bodies are designed not to move. "Kinematic" is better?
    // Phaser 3 Arcade Physics doesn't have "Kinematic" in the same way. It has dynamic bodies with `immovable: true`.

    this.movingPlatforms = this.physics.add.group({
        allowGravity: false,
        immovable: true
    });

    this.levelData.platforms.forEach(p => {
      let platform;

      if (p.move || p.type === 'crumble') {
          // Use dynamic body for moving/crumbling
          platform = this.add.tileSprite(p.x, p.y, p.w, p.h, 'ground');
          this.physics.add.existing(platform);
          platform.body.setAllowGravity(false);
          platform.body.setImmovable(true);
          this.movingPlatforms.add(platform);
      } else {
          // Standard static platform
          platform = this.add.tileSprite(p.x, p.y, p.w, p.h, 'ground');
          this.physics.add.existing(platform, true);
          this.platforms.add(platform);
      }

      // Moving Platform Logic
      if (p.move) {
          platform.setData('isMoving', true);
          platform.setData('moveSpeed', p.move.speed || 100); // Not used if tweening

          this.tweens.add({
              targets: platform,
              x: p.move.x ? p.x + p.move.x : p.x,
              y: p.move.y ? p.y + p.move.y : p.y,
              duration: p.move.duration || 2000,
              yoyo: true,
              repeat: -1,
              ease: 'Sine.easeInOut',
              onUpdate: (tween, target) => {
                  // Update body position to match sprite
                  // We need to calculate delta for player movement.
                  const prevX = target.getData('prevX') || target.x;
                  const prevY = target.getData('prevY') || target.y;

                  target.setData('deltaX', target.x - prevX);
                  target.setData('deltaY', target.y - prevY);

                  target.setData('prevX', target.x);
                  target.setData('prevY', target.y);
              }
          });
      }

      // Crumbling Platform Logic
      if (p.type === 'crumble') {
          platform.setData('isCrumble', true);
          platform.setTint(0xaaaaaa); // Visual cue
      }
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
        enemy.setData('originY', enemyData.y);
        enemy.setData('type', type);

        if (type === 'flying') {
            enemy.body.setAllowGravity(false);
            enemy.setVelocityX(100);
        } else if (type === 'vertical') {
            enemy.body.setAllowGravity(false);
            // Vertical movement tween
            this.tweens.add({
                targets: enemy,
                y: enemyData.y + (enemyData.range || 200),
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            enemy.setGravityY(800);
            enemy.setVelocityX(150);
        }

        this.enemies.add(enemy);
    });

    // --- Collisions ---
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.movingPlatforms, this.handlePlatformCollision, null, this);

    if (ground) {
        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.enemies, ground);
    }
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.collider(this.enemies, this.movingPlatforms);
    this.physics.add.collider(this.player, this.enemies, this.hitEnemy, null, this);

    // --- Goal ---
    this.goal = this.physics.add.sprite(this.levelData.goal.x, this.levelData.goal.y, 'goal');
    this.goal.body.setAllowGravity(false);
    this.goal.setImmovable(true);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    // --- UI ---
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fill: '#fff',
        padding: { top: 10, bottom: 10 }
    }).setScrollFactor(0); // Fix to screen

    this.statusText = this.add.text(400, 300, '', {
        fontSize: '48px',
        fill: '#fff',
        align: 'center',
        padding: { top: 10, bottom: 10 }
    }).setOrigin(0.5);
    this.statusText.setScrollFactor(0); // Fix to screen

    // Level Name Display
    const levelText = this.add.text(400, 50, this.levelData.name, { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);
    levelText.setScrollFactor(0);
    this.time.delayedCall(2000, () => levelText.destroy());
  }

  handlePlatformCollision(player, platform) {
      // Moving Platform: Move player with it
      if (platform.getData('isMoving')) {
          if (player.body.touching.down && platform.body.touching.up) {
              const deltaX = platform.getData('deltaX');
              const deltaY = platform.getData('deltaY');

              if (deltaX) {
                  player.x += deltaX;
              }
              if (deltaY) {
                  player.y += deltaY;
              }
          }
      }

      // Crumbling Platform
      if (platform.getData('isCrumble') && !platform.getData('crumbling')) {
          if (player.body.touching.down && platform.body.touching.up) {
              platform.setData('crumbling', true);

              // Shake effect
              this.tweens.add({
                  targets: platform,
                  x: platform.x + 5,
                  duration: 50,
                  yoyo: true,
                  repeat: 10,
                  onComplete: () => {
                      // Disable and hide
                      platform.body.setEnable(false);
                      platform.setVisible(false);
                      // Optional: Respawn? No, permanent for now.
                  }
              });
          }
      }
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

        if (type === 'vertical') {
            // Handled by tween, just check bounds
        } else if (type === 'flying') {
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
    this.statusText.setText(this.t.GAME_OVER);
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

    this.statusText.setText(this.t.YOU_WIN);
    this.soundManager.playWin();

    this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('StageSelectScene');
    });
  }
}
