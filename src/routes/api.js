import express from 'express';
import GameState from '../models/GameState.js';
import AIService from '../services/AIService.js';

const router = express.Router();

// 初始化游戏状态管理
const gameState = new GameState();

// 初始化AI服务
const apiKey = process.env.DEEPSEEK_API_KEY;
const aiService = new AIService(apiKey);

// 开始新游戏
router.post('/start', (req, res) => {
  try {
    const gameId = gameState.createGame();
    res.json({ gameId });
  } catch (error) {
    console.error('开始游戏时出错:', error);
    res.status(500).json({ error: '开始游戏失败' });
  }
});

// 获取选择
router.get('/choices/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = gameState.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ error: '游戏不存在' });
    }

    let prompt = '';
    
    // 根据时间线生成不同的提示
    if (game.timeline === 1907) {
      prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，在这个人生转折点，你有哪些可能的选择？请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于继续追求艺术、寻找其他职业、改变生活环境等。';
    } else if (game.timeline >= 1914 && game.timeline <= 1918) {
      prompt = '作为参加第一次世界大战的阿道夫·希特勒，你在战争中面临着各种挑战和机遇。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于战场表现、人际关系、未来规划等。';
    } else if (game.timeline >= 1933 && game.timeline <= 1939) {
      prompt = '作为德国领导人的阿道夫·希特勒，在二战前夕，你面临着重要的政治和军事决策。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于外交政策、军事准备、国内政策等。';
    } else if (game.timeline >= 1939 && game.timeline <= 1945) {
      prompt = '作为二战期间的阿道夫·希特勒，你面临着战争的各种挑战和决策。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于军事战略、外交谈判、国内管理等。';
    } else if (game.timeline > 1945) {
      prompt = '作为战后的阿道夫·希特勒，你面临着新的人生挑战和机遇。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于生活方式、职业选择、个人反思等。';
    }

    if (game.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        prompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }

    const choices = await aiService.generateChoices(prompt, game.timeline);
    res.json({ choices });
  } catch (error) {
    console.error('获取选择时出错:', error);
    res.status(500).json({ error: '获取选择失败' });
  }
});

// 提交选择并获取结果
router.post('/choice/:gameId', async (req, res) => {
  try {
    const gameId = req.params.gameId;
    const game = gameState.getGame(gameId);
    
    if (!game) {
      return res.status(404).json({ error: '游戏不存在' });
    }

    const choiceIndex = req.body.choiceIndex;

    // 获取当前选择
    let prompt = '';
    
    if (game.timeline === 1907) {
      prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，在这个人生转折点，你有哪些可能的选择？请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于继续追求艺术、寻找其他职业、改变生活环境等。';
    } else if (game.timeline >= 1914 && game.timeline <= 1918) {
      prompt = '作为参加第一次世界大战的阿道夫·希特勒，你在战争中面临着各种挑战和机遇。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于战场表现、人际关系、未来规划等。';
    } else if (game.timeline >= 1933 && game.timeline <= 1939) {
      prompt = '作为德国领导人的阿道夫·希特勒，在二战前夕，你面临着重要的政治和军事决策。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于外交政策、军事准备、国内政策等。';
    } else if (game.timeline >= 1939 && game.timeline <= 1945) {
      prompt = '作为二战期间的阿道夫·希特勒，你面临着战争的各种挑战和决策。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于军事战略、外交谈判、国内管理等。';
    } else if (game.timeline > 1945) {
      prompt = '作为战后的阿道夫·希特勒，你面临着新的人生挑战和机遇。请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于生活方式、职业选择、个人反思等。';
    }

    if (game.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        prompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }

    const choicesText = await aiService.generateChoices(prompt, game.timeline);
    const choices = choicesText.split('\n').filter(function(c) { return c.trim(); });
    const selectedChoice = choices[choiceIndex - 1] || '未知选择';

    // 生成结果
    let resultPrompt = '';
    
    if (game.timeline === 1907) {
      resultPrompt = '作为1907年艺术学院落榜的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括短期和中期影响，以及它如何改变你的人生轨迹。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    } else if (game.timeline >= 1914 && game.timeline <= 1918) {
      resultPrompt = '作为参加第一次世界大战的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括在战争中的影响、对个人成长的影响，以及对未来的影响。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    } else if (game.timeline >= 1933 && game.timeline <= 1939) {
      resultPrompt = '作为德国领导人的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括对德国国内的影响、对国际关系的影响，以及对即将到来的战争的影响。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    } else if (game.timeline >= 1939 && game.timeline <= 1945) {
      resultPrompt = '作为二战期间的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括对战争进程的影响、对军队士气的影响，以及对最终结局的影响。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    } else if (game.timeline > 1945) {
      resultPrompt = '作为战后的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括对个人生活的影响、对社会的影响，以及对历史评价的影响。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    }

    if (game.history.length > 0) {
      resultPrompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        resultPrompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }

    const result = await aiService.generateResult(resultPrompt, game.timeline);

    // 更新游戏状态
    game.history.push({ choice: selectedChoice, result });
    game.currentStep++;
    
    // 更新时间线
    if (game.timeline === 1907 && game.currentStep >= 2) {
      game.timeline = 1914; // 进入一战时期
    } else if (game.timeline === 1914 && game.currentStep >= 4) {
      game.timeline = 1933; // 进入二战前夕
    } else if (game.timeline === 1933 && game.currentStep >= 6) {
      game.timeline = 1939; // 进入二战时期
    } else if (game.timeline === 1939 && game.currentStep >= 8) {
      game.timeline = 1946; // 进入战后时期
    } else if (game.currentStep >= 10) {
      game.gameOver = true; // 游戏结束
    }

    gameState.updateGame(gameId, game);

    let responseData = { result, gameOver: game.gameOver, timeline: game.timeline };

    if (game.gameOver) {
      // 生成结局
      let endingPrompt = '作为阿道夫·希特勒，基于以下选择和结果，请生成一个详细的人生总结和历史影响分析：';
      game.history.forEach(function(item, index) {
        endingPrompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
      endingPrompt += '\n\n总结应该包括：1. 最终的人生成就；2. 对个人的影响；3. 对历史的可能影响；4. 与真实历史的对比。';
      const ending = await aiService.generateEnding(endingPrompt);
      responseData.ending = ending;
      responseData.history = game.history;
    }

    res.json(responseData);
  } catch (error) {
    console.error('提交选择时出错:', error);
    res.status(500).json({ error: '提交选择失败' });
  }
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default router;
