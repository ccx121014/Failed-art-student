const OpenAI = require('openai');
const ContentFilter = require('../utils/contentFilter');
const Cache = require('../utils/cache');

// 添加字符串的hashCode方法
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  return hash;
};

class AIInterface {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.useMock = !this.apiKey; // 如果没有API密钥，使用模拟数据
    this.contentFilter = new ContentFilter();
    this.cache = new Cache();
    
    if (!this.useMock) {
      this.openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: 'https://integrate.api.nvidia.com/v1'
      });
    }
  }

  async generateChoices(prompt) {
    // 检查缓存
    const cacheKey = `choices_${prompt.hashCode()}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockChoices = this.getMockChoices();
      const filteredContent = this.contentFilter.filterContent(mockChoices);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }

    try {
      const content = await this.callOpenAI(prompt);
      const filteredContent = this.contentFilter.filterContent(content);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    } catch (error) {
      console.error('调用AI API时出错:', error);
      const mockChoices = this.getMockChoices();
      const filteredContent = this.contentFilter.filterContent(mockChoices);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }
  }

  async generateResult(prompt) {
    // 检查缓存
    const cacheKey = `result_${prompt.hashCode()}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockResult = this.getMockResult();
      const filteredContent = this.contentFilter.filterContent(mockResult);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }

    try {
      const content = await this.callOpenAI(prompt);
      const filteredContent = this.contentFilter.filterContent(content);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    } catch (error) {
      console.error('调用AI API时出错:', error);
      const mockResult = this.getMockResult();
      const filteredContent = this.contentFilter.filterContent(mockResult);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }
  }

  async generateEnding(prompt) {
    // 检查缓存
    const cacheKey = `ending_${prompt.hashCode()}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockEnding = this.getMockEnding();
      const filteredContent = this.contentFilter.filterContent(mockEnding);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }

    try {
      const content = await this.callOpenAI(prompt);
      const filteredContent = this.contentFilter.filterContent(content);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    } catch (error) {
      console.error('调用AI API时出错:', error);
      const mockEnding = this.getMockEnding();
      const filteredContent = this.contentFilter.filterContent(mockEnding);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }
  }

  async callOpenAI(prompt) {
    try {
      const completion = await this.openai.chat.completions.create({
        model: "deepseek-ai/deepseek-v3.2",
        messages: [{"role":"user","content":prompt}],
        temperature: 1,
        top_p: 0.95,
        max_tokens: 8192,
        chat_template_kwargs: {"thinking":true},
        stream: true
      });

      let fullContent = '';
      for await (const chunk of completion) {
        const reasoning = chunk.choices[0]?.delta?.reasoning_content;
        if (reasoning) fullContent += reasoning;
        fullContent += chunk.choices[0]?.delta?.content || '';
      }

      return fullContent;
    } catch (error) {
      console.error('OpenAI API调用失败:', error.message);
      if (error.status === 401) {
        console.error('认证错误：API密钥可能无效或已过期');
      }
      throw error;
    }
  }

  getMockChoices() {
    const choiceSets = [
      [
        '继续追求艺术梦想，在维也纳街头卖画为生',
        '寻找其他职业道路，比如成为一名建筑师',
        '返回故乡奥地利，帮助父亲管理农场'
      ],
      [
        '加入维也纳的艺术团体，寻求志同道合的朋友',
        '前往慕尼黑发展，那里的艺术氛围更浓厚',
        '尝试报考其他艺术学院，如柏林艺术学院'
      ],
      [
        '开始学习政治，关注社会问题',
        '成为一名艺术评论家，用笔杆子表达自己的观点',
        '离开欧洲，前往美国寻求新的机会'
      ]
    ];

    const randomSet = choiceSets[Math.floor(Math.random() * choiceSets.length)];
    return randomSet.join('\n');
  }

  getMockResult() {
    const results = [
      '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。',
      '你选择寻找其他职业道路，成为一名建筑师。你利用自己的艺术天赋，设计了许多独特的建筑作品。你的设计风格融合了古典与现代元素，受到了广泛好评。随着时间推移，你成为了一名知名的建筑师，参与了许多重要建筑的设计。',
      '你返回故乡奥地利，帮助父亲管理农场。虽然远离了艺术，但你在农场的生活中找到了新的乐趣。你开始研究农业技术，改进种植方法，使农场的产量大幅提高。你的成功引起了当地政府的注意，邀请你参与农业改革项目。',
      '你加入了维也纳的艺术团体，结识了许多志同道合的朋友。在他们的鼓励和帮助下，你的艺术水平得到了很大提高。你开始尝试不同的艺术风格，逐渐形成了自己独特的艺术语言。你的作品开始在当地的艺术展览中展出。',
      '你前往慕尼黑发展，那里的艺术氛围更浓厚。在慕尼黑，你接触到了更多的艺术流派和思想，开阔了自己的视野。你开始尝试现代艺术风格，创作了一系列具有争议性的作品。这些作品引起了艺术界的关注，你逐渐在慕尼黑艺术圈崭露头角。',
      '你尝试报考其他艺术学院，如柏林艺术学院。经过充分准备，你成功被录取。在学院里，你接受了系统的艺术教育，艺术技巧得到了很大提升。你开始参加各种艺术比赛和展览，获得了一些奖项。毕业后，你成为了一名职业艺术家。',
      '你开始学习政治，关注社会问题。你对当时的社会现状感到不满，开始撰写文章表达自己的观点。你的文章引起了一些人的关注，你逐渐成为了一名政治活动家。你开始组织集会和演讲，宣传自己的政治理念。',
      '你成为一名艺术评论家，用笔杆子表达自己的观点。你的评论文章犀利而有见地，受到了读者的欢迎。你开始为一些知名艺术杂志撰稿，成为了一名知名的艺术评论家。你的评论对艺术界产生了一定的影响。',
      '你离开欧洲，前往美国寻求新的机会。在美国，你面临着新的挑战和机遇。你开始在纽约的艺术圈发展，接触到了更多的艺术形式和思想。你逐渐适应了美国的生活，成为了一名在美国发展的艺术家。'    ];

    return results[Math.floor(Math.random() * results.length)];
  }

  getMockEnding() {
    const endings = [
      '你的人生轨迹与真实历史截然不同。你成为了一名成功的艺术家，以自己的作品闻名于世。你的艺术风格独特，对后世产生了深远的影响。你过着平静而充实的生活，享年85岁。在你去世后，你的作品被许多博物馆收藏，成为艺术史上的重要遗产。',
      '你的人生充满了波折和挑战，但你始终坚持自己的信念。你成为了一名杰出的建筑师，设计了许多标志性建筑。你的作品不仅美观，而且实用，为人们的生活带来了便利。你被认为是20世纪最伟大的建筑师之一，你的名字将永远被人们铭记。',
      '你选择了一条与艺术完全不同的道路，但你同样取得了成功。你成为了一名杰出的农业专家，为当地的农业发展做出了重要贡献。你的创新方法提高了农作物的产量，帮助许多农民摆脱了贫困。你被视为农业改革的先驱，受到了人们的尊敬和爱戴。',
      '你的人生充满了艺术的气息。你成为了一名知名的艺术评论家，你的评论文章影响了许多艺术家的创作。你还培养了许多年轻的艺术家，为艺术界注入了新的活力。你的贡献被艺术界广泛认可，你被誉为艺术界的良心。',
      '你选择了政治道路，成为了一名有影响力的政治人物。你的政治理念关注民生，致力于改善普通民众的生活。你通过和平手段推动社会改革，赢得了人们的支持和信任。你成为了一名受人尊敬的政治家，为国家的发展做出了重要贡献。'    ];

    return endings[Math.floor(Math.random() * endings.length)];
  }
}

module.exports = AIInterface;
