class SceneManager {
  constructor() {
    this.scenes = {
      initial: this.getInitialScene()
    };
  }

  getInitialScene() {
    return {
      title: '1907年，维也纳艺术学院',
      description: '你是阿道夫·希特勒，一位来自奥地利的年轻艺术家。\n你满怀希望地报考了维也纳艺术学院，但不幸落榜了。\n这是你人生的一个重要转折点，你的选择将影响你的未来...',
      choices: [
        '继续追求艺术梦想，在维也纳街头卖画为生',
        '寻找其他职业道路，比如成为一名建筑师',
        '返回故乡奥地利，帮助父亲管理农场'
      ]
    };
  }

  getScene(sceneId) {
    return this.scenes[sceneId] || null;
  }

  addScene(sceneId, sceneData) {
    this.scenes[sceneId] = sceneData;
  }

  getHistoricalContext() {
    return {
      year: 1907,
      location: '维也纳',
      background: '阿道夫·希特勒出生于1889年4月20日，是奥地利海关官员阿洛伊斯·希特勒和他的第三任妻子克拉拉·波尔兹尔的儿子。1907年，希特勒前往维也纳报考艺术学院，但两次均未被录取。这段经历对他的人生产生了深远的影响。',
      historicalEvents: [
        '1907年：希特勒首次报考维也纳艺术学院，未被录取',
        '1908年：希特勒再次报考维也纳艺术学院，再次未被录取',
        '1909-1913年：希特勒在维也纳过着流浪生活，靠卖画和打零工为生',
        '1913年：希特勒前往慕尼黑，避免被奥地利征兵',
        '1914年：第一次世界大战爆发，希特勒加入德国军队'
      ]
    };
  }

  generateSceneDescription(currentState) {
    // 根据当前游戏状态生成场景描述
    let description = '';
    
    if (currentState.history.length === 0) {
      description = this.scenes.initial.description;
    } else {
      // 根据历史选择生成场景描述
      const lastChoice = currentState.history[currentState.history.length - 1];
      description = `你选择了：${lastChoice.choice}。${lastChoice.result}`;
    }
    
    return description;
  }
}

module.exports = SceneManager;
