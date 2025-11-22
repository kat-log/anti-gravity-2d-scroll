import Phaser from 'phaser';
import StageSelectScene from './scenes/StageSelectScene';
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
      debug: false
    }
  },
  scene: [StageSelectScene, GameScene]
};

const game = new Phaser.Game(config);
