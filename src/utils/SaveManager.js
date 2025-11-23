const STORAGE_KEY = 'anti-gravity-save-data';

export default class SaveManager {
  static getProgress() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  }

  static saveLevelProgress(levelId, score) {
    const progress = this.getProgress();
    const levelData = progress[levelId] || { cleared: false, highScore: 0 };

    levelData.cleared = true;
    if (score > levelData.highScore) {
      levelData.highScore = score;
    }

    progress[levelId] = levelData;
    progress[levelId] = levelData;
    this.saveProgress(progress);
  }

  static saveProgress(progress) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  static getLevelData(levelId) {
    const progress = this.getProgress();
    return progress[levelId] || { cleared: false, highScore: 0 };
  }

  static saveCharacter(type) {
    localStorage.setItem(STORAGE_KEY + '-char', type);
  }

  static getCharacter() {
    return localStorage.getItem(STORAGE_KEY + '-char') || 'standard';
  }

  static setLanguage(lang) {
    localStorage.setItem(STORAGE_KEY + '-lang', lang);
  }

  static getLanguage() {
    return localStorage.getItem(STORAGE_KEY + '-lang') || 'en';
  }

  static setDebugMode(enabled) {
    localStorage.setItem(STORAGE_KEY + '-debug', enabled);
  }

  static getDebugMode() {
    return localStorage.getItem(STORAGE_KEY + '-debug') === 'true';
  }

  static setLevelCleared(levelId, isCleared) {
    const progress = this.getProgress();
    if (!progress[levelId]) progress[levelId] = { cleared: false, highScore: 0 };
    progress[levelId].cleared = isCleared;
    this.saveProgress(progress);
  }
}
