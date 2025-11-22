import Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import './style.css';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 }, // We apply gravity per object or globally here
      debug: true
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
