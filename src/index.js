import { OpenAI } from 'openai';

const apiKey = process.env.DEEPSEEK_API_KEY;
let openai;

if (apiKey) {
  openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://integrate.api.nvidia.com/v1'
  });
}

// 模拟数据，当API Key不可用时使用
const mockChoices = [
  '1. 继续追求艺术梦想，在维也纳街头卖画为生',
  '2. 寻找其他职业道路，比如成为一名建筑师',
  '3. 返回故乡奥地利，帮助父亲管理农场'
];

const mockResults = [
  '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。',
  '你选择寻找其他职业道路，成为一名建筑师。你利用自己的艺术天赋，设计了许多独特的建筑作品。你的设计风格融合了古典与现代元素，受到了广泛好评。随着时间推移，你成为了一名知名的建筑师，参与了许多重要建筑的设计。',
  '你返回故乡奥地利，帮助父亲管理农场。虽然远离了艺术，但你在农场的生活中找到了新的乐趣。你开始研究农业技术，改进种植方法，使农场的产量大幅提高。你的成功引起了当地政府的注意，邀请你参与农业改革项目。'
];

const mockEndings = [
  '你的人生轨迹与真实历史截然不同。你成为了一名成功的艺术家，以自己的作品闻名于世。你的艺术风格独特，对后世产生了深远的影响。你过着平静而充实的生活，享年85岁。在你去世后，你的作品被许多博物馆收藏，成为艺术史上的重要遗产。',
  '你的人生充满了波折和挑战，但你始终坚持自己的信念。你成为了一名杰出的建筑师，设计了许多标志性建筑。你的作品不仅美观，而且实用，为人们的生活带来了便利。你被认为是20世纪最伟大的建筑师之一，你的名字将永远被人们铭记。',
  '你选择了一条与艺术完全不同的道路，但你同样取得了成功。你成为了一名杰出的农业专家，为当地的农业发展做出了重要贡献。你的创新方法提高了农作物的产量，帮助许多农民摆脱了贫困。你被视为农业改革的先驱，受到了人们的尊敬和爱戴。'
];

// 游戏状态管理
class GameState {
  constructor() {
    this.games = new Map();
  }

  createGame() {
    const gameId = Math.random().toString(36).substring(2, 15);
    this.games.set(gameId, {
      history: [],
      playerChoices: [],
      currentStep: 0,
      gameOver: false
    });
    return gameId;
  }

  getGame(gameId) {
    return this.games.get(gameId);
  }

  updateGame(gameId, updates) {
    const game = this.getGame(gameId);
    if (game) {
      Object.assign(game, updates);
      this.games.set(gameId, game);
    }
  }

  deleteGame(gameId) {
    this.games.delete(gameId);
  }
}

const gameState = new GameState();

// 内容过滤
class ContentFilter {
  constructor() {
    this.sensitiveKeywords = [
      '纳粹', '法西斯', '种族灭绝', '反犹', '希特勒', '大屠杀',
      '独裁', '极权', '暴力', '仇恨', '歧视', '迫害',
      '战争罪行', '集中营', '种族清洗', '反人类'
    ];
  }

  filterContent(content) {
    if (!content) return content;

    let filteredContent = content;
    for (const keyword of this.sensitiveKeywords) {
      if (filteredContent.toLowerCase().includes(keyword.toLowerCase())) {
        filteredContent = filteredContent.replace(new RegExp(keyword, 'gi'), '*'.repeat(keyword.length));
      }
    }

    return filteredContent;
  }
}

const contentFilter = new ContentFilter();

// AI调用
async function callOpenAI(prompt) {
  try {
    if (!openai) {
      throw new Error('API Key不可用');
    }
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v3.2",
      messages: [{"role":"user","content":prompt}],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 8192,
      chat_template_kwargs: {"thinking":true},
      stream: false
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API调用失败:', error.message);
    throw error;
  }
}

// 生成选择
async function generateChoices(prompt) {
  try {
    const content = await callOpenAI(prompt);
    return contentFilter.filterContent(content);
  } catch (error) {
    console.error('生成选择时出错:', error);
    return mockChoices.join('\n');
  }
}

// 生成结果
async function generateResult(prompt) {
  try {
    const content = await callOpenAI(prompt);
    return contentFilter.filterContent(content);
  } catch (error) {
    console.error('生成结果时出错:', error);
    return mockResults[Math.floor(Math.random() * mockResults.length)];
  }
}

// 生成结局
async function generateEnding(prompt) {
  try {
    const content = await callOpenAI(prompt);
    return contentFilter.filterContent(content);
  } catch (error) {
    console.error('生成结局时出错:', error);
    return mockEndings[Math.floor(Math.random() * mockEndings.length)];
  }
}

// 处理请求
async function handleRequest(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  if (path === '/') {
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>落榜美术生模拟器</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          .container { background-color: #f5f5f5; padding: 20px; border-radius: 8px; }
          h1 { color: #333; }
          .btn { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 5px; }
          .btn:hover { background-color: #45a049; }
          .choice { margin: 10px 0; }
          .result { margin: 20px 0; padding: 10px; background-color: #e8f4f8; border-left: 4px solid #2196F3; }
          .history { margin: 20px 0; padding: 10px; background-color: #f9f9f9; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>落榜美术生模拟器</h1>
          <p>模拟阿道夫·希特勒在1907年艺术学院落榜后的人生选择</p>
          <button class="btn" onclick="startGame()">开始游戏</button>
          <div id="game-container" style="display: none;">
            <h2 id="game-title">1907年，维也纳艺术学院</h2>
            <p id="game-description">你是阿道夫·希特勒，一位来自奥地利的年轻艺术家。你满怀希望地报考了维也纳艺术学院，但不幸落榜了。这是你人生的一个重要转折点，你的选择将影响你的未来...</p>
            <div id="choices-container"></div>
            <div id="result-container" class="result" style="display: none;"></div>
            <div id="history-container" class="history" style="display: none;"></div>
            <div id="ending-container" style="display: none;"></div>
          </div>
        </div>
        <script>
          let gameId;
          
          async function startGame() {
            const response = await fetch('/api/start', { method: 'POST' });
            const data = await response.json();
            gameId = data.gameId;
            document.getElementById('game-container').style.display = 'block';
            await getChoices();
          }
          
          async function getChoices() {
            const response = await fetch('/api/choices/' + gameId);
            const data = await response.json();
            const choicesContainer = document.getElementById('choices-container');
            choicesContainer.innerHTML = '<h3>请选择你的下一步行动：</h3>';
            data.choices.split('\n').forEach(function(choice, index) {
              if (choice.trim()) {
                const button = document.createElement('button');
                button.className = 'btn';
                button.textContent = choice;
                button.onclick = function() { makeChoice(index + 1); };
                choicesContainer.appendChild(button);
                choicesContainer.appendChild(document.createElement('br'));
              }
            });
          }
          
          async function makeChoice(choiceIndex) {
            const response = await fetch('/api/choice/' + gameId, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ choiceIndex: choiceIndex })
            });
            const data = await response.json();
            const resultContainer = document.getElementById('result-container');
            resultContainer.textContent = data.result;
            resultContainer.style.display = 'block';
            
            if (data.gameOver) {
              document.getElementById('choices-container').style.display = 'none';
              const endingContainer = document.getElementById('ending-container');
              endingContainer.innerHTML = '<h3>游戏结束</h3><p>' + data.ending + '</p>';
              endingContainer.style.display = 'block';
              const historyContainer = document.getElementById('history-container');
              var historyHTML = '<h3>你的人生轨迹：</h3><ul>';
              for (var i = 0; i < data.history.length; i++) {
                var item = data.history[i];
                historyHTML += '<li>选择：' + item.choice + '<br>结果：' + item.result + '</li>';
              }
              historyHTML += '</ul>';
              historyContainer.innerHTML = historyHTML;
              historyContainer.style.display = 'block';
            } else {
              setTimeout(getChoices, 2000);
            }
          }
        </script>
      </body>
      </html>`,
      { headers: { 'Content-Type': 'text/html' } }
    );
  } else if (path.startsWith('/api/start')) {
    const gameId = gameState.createGame();
    return new Response(JSON.stringify({ gameId }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else if (path.startsWith('/api/choices/')) {
    const gameId = path.split('/').pop();
    const game = gameState.getGame(gameId);
    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，在这个人生转折点，你有哪些可能的选择？请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于继续追求艺术、寻找其他职业、改变生活环境等。';
    
    if (game.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        prompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }

    const choices = await generateChoices(prompt);
    return new Response(JSON.stringify({ choices }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else if (path.startsWith('/api/choice/')) {
    const gameId = path.split('/').pop();
    const game = gameState.getGame(gameId);
    if (!game) {
      return new Response(JSON.stringify({ error: '游戏不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await request.json();
    const choiceIndex = body.choiceIndex;

    // 获取当前选择
    let prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，在这个人生转折点，你有哪些可能的选择？请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于继续追求艺术、寻找其他职业、改变生活环境等。';
    if (game.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        prompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }
    const choicesText = await generateChoices(prompt);
    const choices = choicesText.split('\n').filter(function(c) { return c.trim(); });
    const selectedChoice = choices[choiceIndex - 1] || '未知选择';

    // 生成结果
    let resultPrompt = '作为1907年艺术学院落榜的阿道夫·希特勒，你选择了：' + selectedChoice + '。请详细描述这个选择导致的结果，包括短期和中期影响，以及它如何改变你的人生轨迹。结果应该具体、生动，符合历史背景，但可以有合理的虚构。';
    if (game.history.length > 0) {
      resultPrompt += '\n\n之前的选择和结果：';
      game.history.forEach(function(item, index) {
        resultPrompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
    }
    const result = await generateResult(resultPrompt);

    // 更新游戏状态
    game.history.push({ choice: selectedChoice, result });
    game.currentStep++;
    game.gameOver = game.currentStep >= 3; // 简化为3步结束
    gameState.updateGame(gameId, game);

    let responseData = { result, gameOver: game.gameOver };

    if (game.gameOver) {
      // 生成结局
      let endingPrompt = '作为1907年艺术学院落榜的阿道夫·希特勒，基于以下选择和结果，请生成一个详细的人生总结和历史影响分析：';
      game.history.forEach(function(item, index) {
        endingPrompt += '\n' + (index + 1) + '. 选择：' + item.choice + '\n   结果：' + item.result;
      });
      endingPrompt += '\n\n总结应该包括：1. 最终的人生成就；2. 对个人的影响；3. 对历史的可能影响；4. 与真实历史的对比。';
      const ending = await generateEnding(endingPrompt);
      responseData.ending = ending;
      responseData.history = game.history;
    }

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    return new Response('Not Found', { status: 404 });
  }
}

export default {
  fetch: handleRequest
};
