const AIInterface = require('../ai/interface');
const SceneManager = require('./scenes');

class GameEngine {
  constructor() {
    this.gameState = {
      currentScene: 'initial',
      history: [],
      gameOver: false,
      playerChoices: []
    };
    this.aiInterface = new AIInterface();
    this.sceneManager = new SceneManager();
  }

  async start() {
    await this.initializeGame();
    while (!this.gameState.gameOver) {
      await this.processCurrentScene();
    }
    await this.generateEnding();
  }

  async initializeGame() {
    const initialScene = this.sceneManager.getScene('initial');
    console.log(initialScene.title);
    console.log(initialScene.description);
    console.log('\n');
  }

  async processCurrentScene() {
    try {
      console.log('==================================');
      console.log('思考中...请稍候');
      console.log('==================================');
      
      const choices = await this.generateChoices();
      if (!choices || choices.length === 0) {
        console.log('无法生成选择，请重试。');
        return;
      }

      console.log('\n请选择你的下一步行动：');
      choices.forEach((choice, index) => {
        console.log(`${index + 1}. ${choice}`);
      });

      const userChoice = await this.getUserInput(choices.length);
      const selectedChoice = choices[userChoice - 1];
      
      this.gameState.playerChoices.push(selectedChoice);
      
      console.log('\n==================================');
      console.log('思考中...请稍候');
      console.log('==================================');
      
      const result = await this.generateResult(selectedChoice);
      console.log('\n' + result + '\n');
      
      this.gameState.history.push({
        choice: selectedChoice,
        result: result
      });

      // 检查游戏是否结束
      if (this.gameState.history.length >= 10) {
        this.gameState.gameOver = true;
      }
    } catch (error) {
      console.error('处理场景时出错:', error);
      console.log('发生错误，正在恢复游戏...');
    }
  }

  async generateChoices() {
    try {
      const prompt = this.generateChoicePrompt();
      const response = await this.aiInterface.generateChoices(prompt);
      return this.parseChoices(response);
    } catch (error) {
      console.error('生成选择时出错:', error);
      return ['继续追求艺术梦想', '寻找其他职业道路', '返回故乡奥地利'];
    }
  }

  generateChoicePrompt() {
    let prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，在这个人生转折点，你有哪些可能的选择？请生成3个不同的选择，每个选择应该有不同的方向，包括但不限于继续追求艺术、寻找其他职业、改变生活环境等。';
    
    if (this.gameState.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      this.gameState.history.forEach((item, index) => {
        prompt += `\n${index + 1}. 选择：${item.choice}\n   结果：${item.result}`;
      });
    }
    
    return prompt;
  }

  parseChoices(response) {
    // 简单的解析逻辑，实际项目中可能需要更复杂的解析
    const lines = response.split('\n');
    const choices = [];
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('//') && !trimmedLine.startsWith('#')) {
        choices.push(trimmedLine);
      }
    });
    
    return choices.slice(0, 3); // 确保只返回3个选择
  }

  async getUserInput(maxChoices) {
    return new Promise((resolve) => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      readline.question('请输入选择编号: ', (input) => {
        readline.close();
        const choice = parseInt(input);
        if (isNaN(choice) || choice < 1 || choice > maxChoices) {
          console.log('无效的选择，请重新输入。');
          resolve(this.getUserInput(maxChoices));
        } else {
          resolve(choice);
        }
      });
    });
  }

  async generateResult(choice) {
    try {
      const prompt = this.generateResultPrompt(choice);
      const response = await this.aiInterface.generateResult(prompt);
      return response;
    } catch (error) {
      console.error('生成结果时出错:', error);
      return '你的选择导致了一系列事件，但具体结果无法预测。';
    }
  }

  generateResultPrompt(choice) {
    let prompt = `作为1907年艺术学院落榜的阿道夫·希特勒，你选择了：${choice}。请详细描述这个选择导致的结果，包括短期和中期影响，以及它如何改变你的人生轨迹。结果应该具体、生动，符合历史背景，但可以有合理的虚构。`;
    
    if (this.gameState.history.length > 0) {
      prompt += '\n\n之前的选择和结果：';
      this.gameState.history.forEach((item, index) => {
        prompt += `\n${index + 1}. 选择：${item.choice}\n   结果：${item.result}`;
      });
    }
    
    return prompt;
  }

  async generateEnding() {
    console.log('==================================');
    console.log('游戏结束');
    console.log('==================================');
    console.log('你的人生轨迹：');
    
    this.gameState.history.forEach((item, index) => {
      console.log(`\n${index + 1}. 选择：${item.choice}`);
      console.log(`   结果：${item.result}`);
    });
    
    console.log('\n==================================');
    console.log('分析中...请稍候');
    console.log('==================================');
    
    try {
      const prompt = this.generateEndingPrompt();
      const response = await this.aiInterface.generateEnding(prompt);
      console.log('\n==================================');
      console.log('人生总结与历史影响分析');
      console.log('==================================');
      console.log(response);
      
      // 添加历史对比
      console.log('\n==================================');
      console.log('与真实历史的对比');
      console.log('==================================');
      console.log('在真实历史中，阿道夫·希特勒在艺术学院落榜后，经历了一段艰难的时期，');
      console.log('最终走向了政治道路，成为了纳粹德国的领导人，给世界带来了巨大的灾难。');
      console.log('你的选择创造了一个与真实历史不同的轨迹，展示了人生选择的重要性。');
    } catch (error) {
      console.error('生成结局时出错:', error);
      console.log('\n==================================');
      console.log('人生总结');
      console.log('==================================');
      console.log('你的选择导致了一个独特的人生轨迹，影响了历史的进程。');
      console.log('虽然无法生成详细分析，但你的每一个选择都意义重大。');
    }
  }

  generateEndingPrompt() {
    let prompt = '作为1907年艺术学院落榜的阿道夫·希特勒，基于以下选择和结果，请生成一个详细的人生总结和历史影响分析：';
    
    this.gameState.history.forEach((item, index) => {
      prompt += `\n${index + 1}. 选择：${item.choice}\n   结果：${item.result}`;
    });
    
    prompt += '\n\n总结应该包括：1. 最终的人生成就；2. 对个人的影响；3. 对历史的可能影响；4. 与真实历史的对比。';
    
    return prompt;
  }
}

module.exports = GameEngine;
