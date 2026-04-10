import { OpenAI } from 'openai';
import ContentFilter from '../utils/ContentFilter.js';

class AIService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.useMock = !apiKey;
    this.contentFilter = new ContentFilter();
    this.openai = null;

    if (!this.useMock) {
      this.openai = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1'
      });
    }
  }

  // 模拟数据
  getMockChoices() {
    return [
      '1. 继续追求艺术梦想，在维也纳街头卖画为生',
      '2. 寻找其他职业道路，比如成为一名建筑师',
      '3. 返回故乡奥地利，帮助父亲管理农场'
    ];
  }

  getMockResults() {
    return [
      '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。',
      '你选择寻找其他职业道路，成为一名建筑师。你利用自己的艺术天赋，设计了许多独特的建筑作品。你的设计风格融合了古典与现代元素，受到了广泛好评。随着时间推移，你成为了一名知名的建筑师，参与了许多重要建筑的设计。',
      '你返回故乡奥地利，帮助父亲管理农场。虽然远离了艺术，但你在农场的生活中找到了新的乐趣。你开始研究农业技术，改进种植方法，使农场的产量大幅提高。你的成功引起了当地政府的注意，邀请你参与农业改革项目。'
    ];
  }

  getMockEndings() {
    return [
      '你的人生轨迹与真实历史截然不同。你成为了一名成功的艺术家，以自己的作品闻名于世。你的艺术风格独特，对后世产生了深远的影响。你过着平静而充实的生活，享年85岁。在你去世后，你的作品被许多博物馆收藏，成为艺术史上的重要遗产。',
      '你的人生充满了波折和挑战，但你始终坚持自己的信念。你成为了一名杰出的建筑师，设计了许多标志性建筑。你的作品不仅美观，而且实用，为人们的生活带来了便利。你被认为是20世纪最伟大的建筑师之一，你的名字将永远被人们铭记。',
      '你选择了一条与艺术完全不同的道路，但你同样取得了成功。你成为了一名杰出的农业专家，为当地的农业发展做出了重要贡献。你的创新方法提高了农作物的产量，帮助许多农民摆脱了贫困。你被视为农业改革的先驱，受到了人们的尊敬和爱戴。'
    ];
  }

  // 调用OpenAI API
  async callOpenAI(prompt) {
    try {
      if (!this.openai) {
        throw new Error('API Key不可用');
      }
      const completion = await this.openai.chat.completions.create({
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
  async generateChoices(prompt, timeline) {
    try {
      // 根据时间线调整提示
      let timelinePrompt = '';
      if (timeline >= 1914 && timeline <= 1918) {
        timelinePrompt = '现在是第一次世界大战期间，';
      } else if (timeline >= 1939 && timeline <= 1945) {
        timelinePrompt = '现在是第二次世界大战期间，';
      } else if (timeline > 1945) {
        timelinePrompt = '现在是战后时期，';
      }

      const fullPrompt = timelinePrompt + prompt;
      const content = await this.callOpenAI(fullPrompt);
      return this.contentFilter.filterContent(content);
    } catch (error) {
      console.error('生成选择时出错:', error);
      return this.getMockChoices().join('\n');
    }
  }

  // 生成结果
  async generateResult(prompt, timeline) {
    try {
      // 根据时间线调整提示
      let timelinePrompt = '';
      if (timeline >= 1914 && timeline <= 1918) {
        timelinePrompt = '现在是第一次世界大战期间，';
      } else if (timeline >= 1939 && timeline <= 1945) {
        timelinePrompt = '现在是第二次世界大战期间，';
      } else if (timeline > 1945) {
        timelinePrompt = '现在是战后时期，';
      }

      const fullPrompt = timelinePrompt + prompt;
      const content = await this.callOpenAI(fullPrompt);
      return this.contentFilter.filterContent(content);
    } catch (error) {
      console.error('生成结果时出错:', error);
      return this.getMockResults()[Math.floor(Math.random() * this.getMockResults().length)];
    }
  }

  // 生成结局
  async generateEnding(prompt) {
    try {
      const content = await this.callOpenAI(prompt);
      return this.contentFilter.filterContent(content);
    } catch (error) {
      console.error('生成结局时出错:', error);
      return this.getMockEndings()[Math.floor(Math.random() * this.getMockEndings().length)];
    }
  }
}

export default AIService;
