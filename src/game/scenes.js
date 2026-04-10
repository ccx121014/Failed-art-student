class SceneManager {
  constructor() {
    this.scenes = {
      initial: this.getInitialScene(),
      ww1: this.getWW1Scene(),
      preWW2: this.getPreWW2Scene(),
      ww2: this.getWW2Scene(),
      postWW2: this.getPostWW2Scene()
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

  getWW1Scene() {
    return {
      title: '1914年，第一次世界大战',
      description: '第一次世界大战爆发，你加入了德国军队。\n战争的残酷与混乱改变了你的世界观，你在战场上经历了许多生死考验。\n你的选择将决定你在战争中的命运，以及战后的人生道路...',
      choices: [
        '在战场上表现英勇，争取晋升机会',
        '专注于战地宣传工作，发挥你的艺术天赋',
        '尽可能躲避危险，保存自己的生命'
      ]
    };
  }

  getPreWW2Scene() {
    return {
      title: '1933年，纳粹党掌权',
      description: '你成为了德国的领导人，纳粹党在德国掌权。\n你面临着重大的政治和军事决策，这些决策将影响整个欧洲乃至世界的命运。\n你的选择将决定德国的未来，以及即将到来的战争走向...',
      choices: [
        '加强军备，准备对外扩张',
        '专注于国内经济建设，改善民生',
        '寻求与其他国家的和平合作'
      ]
    };
  }

  getWW2Scene() {
    return {
      title: '1939年，第二次世界大战',
      description: '第二次世界大战爆发，德国军队在欧洲迅速推进。\n你作为德国的最高统帅，面临着无数关键决策。\n你的选择将决定战争的进程，以及数百万人的生死...',
      choices: [
        '集中力量进攻苏联，扩大东部战线',
        '加强对英国的轰炸，迫使英国投降',
        '寻求与盟军的和平谈判'
      ]
    };
  }

  getPostWW2Scene() {
    return {
      title: '1946年，战后时期',
      description: '第二次世界大战结束，德国战败。\n你面临着新的人生挑战，需要在战后的世界中找到自己的位置。\n你的选择将决定你战后的命运，以及历史对你的评价...',
      choices: [
        '接受现实，开始新的生活',
        '坚持自己的信念，继续为自己的理想奋斗',
        '反思过去，寻求赎罪和和解'
      ]
    };
  }

  getScene(sceneId) {
    return this.scenes[sceneId] || null;
  }

  addScene(sceneId, sceneData) {
    this.scenes[sceneId] = sceneData;
  }

  getHistoricalContext(year) {
    if (year === 1907) {
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
    } else if (year >= 1914 && year <= 1918) {
      return {
        year: 1914,
        location: '欧洲战场',
        background: '1914年，第一次世界大战爆发，希特勒加入了德国巴伐利亚预备役步兵团。他在战争中表现英勇，获得了铁十字勋章。战争的经历对他的思想和性格产生了深远的影响。',
        historicalEvents: [
          '1914年：第一次世界大战爆发，希特勒加入德国军队',
          '1916年：希特勒在索姆河战役中受伤',
          '1918年：德国战败，第一次世界大战结束',
          '1919年：希特勒加入德国工人党（纳粹党前身）',
          '1923年：希特勒发动啤酒馆政变，失败后被捕'
        ]
      };
    } else if (year >= 1933 && year <= 1939) {
      return {
        year: 1933,
        location: '德国',
        background: '1933年，希特勒成为德国总理，纳粹党在德国掌权。他开始实施一系列政策，包括扩充军备、迫害犹太人和其他少数群体，以及寻求领土扩张。这些政策最终导致了第二次世界大战的爆发。',
        historicalEvents: [
          '1933年：希特勒成为德国总理，纳粹党掌权',
          '1935年：德国开始重新武装，违反凡尔赛和约',
          '1936年：德国占领莱茵兰非军事区',
          '1938年：德国吞并奥地利，慕尼黑协议签订',
          '1939年：德国入侵波兰，第二次世界大战爆发'
        ]
      };
    } else if (year >= 1939 && year <= 1945) {
      return {
        year: 1939,
        location: '欧洲',
        background: '1939年，德国入侵波兰，第二次世界大战爆发。希特勒作为德国的最高统帅，指挥德国军队在欧洲迅速推进。战争期间，纳粹德国实施了大规模的种族灭绝政策，导致数百万人死亡。',
        historicalEvents: [
          '1939年：德国入侵波兰，第二次世界大战爆发',
          '1940年：德国占领法国，开始对英国进行轰炸',
          '1941年：德国入侵苏联，珍珠港事件爆发',
          '1942年：斯大林格勒战役开始',
          '1945年：德国战败，第二次世界大战结束'
        ]
      };
    } else if (year > 1945) {
      return {
        year: 1946,
        location: '战后世界',
        background: '1945年，德国战败，第二次世界大战结束。希特勒在柏林自杀，纳粹德国被盟军占领。战后，欧洲面临着重建的挑战，同时也对纳粹罪行进行了审判。',
        historicalEvents: [
          '1945年：德国战败，希特勒自杀',
          '1945-1946年：纽伦堡审判',
          '1947年：冷战开始',
          '1949年：德国分裂为东德和西德',
          '1990年：德国统一'
        ]
      };
    }
  }

  getSceneByYear(year) {
    if (year === 1907) {
      return this.scenes.initial;
    } else if (year >= 1914 && year <= 1918) {
      return this.scenes.ww1;
    } else if (year >= 1933 && year <= 1939) {
      return this.scenes.preWW2;
    } else if (year >= 1939 && year <= 1945) {
      return this.scenes.ww2;
    } else if (year > 1945) {
      return this.scenes.postWW2;
    }
    return this.scenes.initial;
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

export default SceneManager;
