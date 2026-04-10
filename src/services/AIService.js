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
  getMockChoices(timeline, previousChoice = null) {
    let choiceSets = [];
    
    // 根据上一步的选择和时间线生成不同的选择
    if (timeline === 1907) {
      if (previousChoice && previousChoice.includes('继续追求艺术梦想')) {
        choiceSets = [
          [
            '1. 参加维也纳艺术学院的补考',
            '2. 前往巴黎，寻求更广阔的艺术发展空间',
            '3. 开始创作政治讽刺画，表达对社会的不满'
          ],
          [
            '1. 加入维也纳的艺术沙龙，结识更多艺术家',
            '2. 开始绘制风景画，寻找新的艺术风格',
            '3. 尝试申请艺术奖学金，获得经济支持'
          ]
        ];
      } else if (previousChoice && previousChoice.includes('寻找其他职业道路')) {
        choiceSets = [
          [
            '1. 学习工程学，成为一名工程师',
            '2. 进入商业领域，成为一名商人',
            '3. 加入军队，寻求稳定的职业发展'
          ],
          [
            '1. 成为一名教师，教授艺术课程',
            '2. 进入出版业，成为一名编辑',
            '3. 开始创业，开设自己的艺术工作室'
          ]
        ];
      } else if (previousChoice && previousChoice.includes('返回故乡')) {
        choiceSets = [
          [
            '1. 扩大农场规模，成为当地的农业大户',
            '2. 参与当地政治，成为一名地方官员',
            '3. 在家乡开设艺术学校，教授当地孩子绘画'
          ],
          [
            '1. 开始研究农业机械，发明新的农具',
            '2. 与当地商人合作，开展农产品贸易',
            '3. 组织农民合作社，提高农民的收入'
          ]
        ];
      } else {
        // 初始选择
        choiceSets = [
          [
            '1. 继续追求艺术梦想，在维也纳街头卖画为生',
            '2. 寻找其他职业道路，比如成为一名建筑师',
            '3. 返回故乡奥地利，帮助父亲管理农场'
          ],
          [
            '1. 加入维也纳的艺术团体，寻求志同道合的朋友',
            '2. 前往慕尼黑发展，那里的艺术氛围更浓厚',
            '3. 尝试报考其他艺术学院，如柏林艺术学院'
          ],
          [
            '1. 开始学习政治，关注社会问题',
            '2. 成为一名艺术评论家，用笔杆子表达自己的观点',
            '3. 离开欧洲，前往美国寻求新的机会'
          ],
          [
            '1. 开始自学绘画，提高自己的艺术水平',
            '2. 寻找艺术赞助人，获得经济支持',
            '3. 开始旅行，寻找艺术灵感'
          ]
        ];
      }
    } else if (timeline >= 1914 && timeline <= 1918) {
      choiceSets = [
        [
          '1. 在战场上表现英勇，争取晋升机会',
          '2. 专注于战地宣传工作，发挥你的艺术天赋',
          '3. 尽可能躲避危险，保存自己的生命'
        ],
        [
          '1. 与战友建立深厚的友谊',
          '2. 学习军事战略和战术',
          '3. 思考战争的意义和未来的和平'
        ],
        [
          '1. 积极参与战斗，争取立功受奖',
          '2. 利用业余时间继续创作艺术作品',
          '3. 开始撰写战争日记，记录战争经历'
        ]
      ];
    } else if (timeline >= 1933 && timeline <= 1939) {
      choiceSets = [
        [
          '1. 加强军备，准备对外扩张',
          '2. 专注于国内经济建设，改善民生',
          '3. 寻求与其他国家的和平合作'
        ],
        [
          '1. 推行民族主义政策，增强国家凝聚力',
          '2. 发展科技和教育，提高国家竞争力',
          '3. 与周边国家建立友好关系，避免冲突'
        ],
        [
          '1. 扩大纳粹党的影响力，巩固统治',
          '2. 投资基础设施建设，创造就业机会',
          '3. 参与国际裁军谈判，维护世界和平'
        ]
      ];
    } else if (timeline >= 1939 && timeline <= 1945) {
      choiceSets = [
        [
          '1. 集中力量进攻苏联，扩大东部战线',
          '2. 加强对英国的轰炸，迫使英国投降',
          '3. 寻求与盟军的和平谈判'
        ],
        [
          '1. 优先发展新型武器，如V-2火箭',
          '2. 加强对占领区的管理，稳定后方',
          '3. 调整军事战略，集中力量防御'
        ],
        [
          '1. 加强与日本的合作，协同作战',
          '2. 动员国内资源，支持战争',
          '3. 考虑投降，避免更多人员伤亡'
        ]
      ];
    } else if (timeline > 1945) {
      choiceSets = [
        [
          '1. 接受现实，开始新的生活',
          '2. 坚持自己的信念，继续为自己的理想奋斗',
          '3. 反思过去，寻求赎罪和和解'
        ],
        [
          '1. 隐姓埋名，过普通人的生活',
          '2. 逃往国外，寻求政治庇护',
          '3. 公开道歉，寻求社会的原谅'
        ],
        [
          '1. 致力于和平事业，反对战争',
          '2. 撰写回忆录，记录自己的经历',
          '3. 参与战后重建，为社会做出贡献'
        ]
      ];
    }

    if (choiceSets.length === 0) {
      choiceSets = [
        [
          '1. 继续追求艺术梦想，在维也纳街头卖画为生',
          '2. 寻找其他职业道路，比如成为一名建筑师',
          '3. 返回故乡奥地利，帮助父亲管理农场'
        ]
      ];
    }

    const randomSet = choiceSets[Math.floor(Math.random() * choiceSets.length)];
    return randomSet;
  }

  getMockResults(choice, timeline) {
    // 根据选择和时间线生成不同的结果
    if (timeline === 1907) {
      if (choice.includes('继续追求艺术梦想')) {
        return [
          '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。',
          '你选择继续追求艺术梦想，每天在维也纳街头作画。你的作品风格独特，吸引了许多路人的注意。一位富有的艺术赞助人看到了你的潜力，决定资助你前往巴黎深造。在巴黎，你接触到了更多的艺术流派，你的创作水平得到了显著提高。',
          '你坚持在维也纳街头卖画，尽管生活艰难，但你从未放弃。你的作品逐渐被当地的艺术圈认可，你开始接到一些商业订单。随着时间推移，你成为了维也纳小有名气的街头艺术家，你的故事被当地媒体报道，激励了许多有艺术梦想的年轻人。'
        ];
      } else if (choice.includes('寻找其他职业道路')) {
        return [
          '你选择寻找其他职业道路，成为一名建筑师。你利用自己的艺术天赋，设计了许多独特的建筑作品。你的设计风格融合了古典与现代元素，受到了广泛好评。随着时间推移，你成为了一名知名的建筑师，参与了许多重要建筑的设计。',
          '你决定寻找其他职业道路，经过深思熟虑，你选择了成为一名工程师。你的艺术背景使你在设计方面有独特的优势，你很快就在工程领域崭露头角。你参与了许多重要的工程项目，成为了一名成功的工程师。',
          '你选择了离开艺术领域，进入商业世界。你利用自己的创造力和洞察力，创办了一家设计公司，专门从事产品设计和品牌策划。你的公司逐渐发展壮大，成为了行业内的佼佼者。'
        ];
      } else if (choice.includes('返回故乡')) {
        return [
          '你返回故乡奥地利，帮助父亲管理农场。虽然远离了艺术，但你在农场的生活中找到了新的乐趣。你开始研究农业技术，改进种植方法，使农场的产量大幅提高。你的成功引起了当地政府的注意，邀请你参与农业改革项目。',
          '你决定返回故乡，帮助父亲管理农场。你将自己的艺术天赋应用到农场的规划和设计中，使农场变得更加美观和高效。你还开始种植一些特色作物，开辟了新的收入来源。你的农场成为了当地的典范，吸引了许多人前来参观学习。',
          '你回到了故乡，在农场工作的同时，你没有放弃对艺术的追求。你开始创作与农村生活相关的艺术作品，记录乡村的美丽和农民的生活。你的作品在当地展览，受到了人们的喜爱和赞赏。'
        ];
      } else if (choice.includes('加入维也纳的艺术团体')) {
        return '你加入了维也纳的艺术团体，结识了许多志同道合的朋友。在他们的影响下，你的艺术风格发生了变化，开始尝试新的创作手法。你参与了团体的多次展览，逐渐在艺术圈崭露头角。';
      } else if (choice.includes('前往慕尼黑')) {
        return '你前往慕尼黑发展，那里的艺术氛围更浓厚。你在慕尼黑结识了许多艺术家，受到了新的艺术思潮的影响。你开始创作更加前卫的作品，逐渐在当地艺术圈获得了认可。';
      } else if (choice.includes('尝试报考其他艺术学院')) {
        return '你决定尝试报考其他艺术学院，如柏林艺术学院。经过刻苦准备，你成功被录取。在柏林艺术学院，你接受了系统的艺术教育，你的创作水平得到了显著提高。';
      } else if (choice.includes('开始学习政治')) {
        return '你开始学习政治，关注社会问题。你参加了一些政治活动，逐渐形成了自己的政治观点。你的艺术作品也开始反映社会现实，引起了人们的关注。';
      } else if (choice.includes('成为一名艺术评论家')) {
        return '你成为了一名艺术评论家，用笔杆子表达自己的观点。你的评论文章犀利而深刻，受到了读者的欢迎。你逐渐成为了艺术圈的重要声音，影响了许多人的艺术观念。';
      } else if (choice.includes('离开欧洲')) {
        return '你离开欧洲，前往美国寻求新的机会。在美国，你接触到了不同的文化和艺术形式，你的创作风格发生了变化。你开始在当地的艺术圈崭露头角，逐渐获得了成功。';
      } else if (choice.includes('开始自学绘画')) {
        return '你开始自学绘画，提高自己的艺术水平。你阅读了大量的艺术书籍，研究了许多大师的作品。通过不断努力，你的绘画技巧得到了显著提高，你的作品开始受到人们的关注。';
      } else if (choice.includes('寻找艺术赞助人')) {
        return '你开始寻找艺术赞助人，希望获得经济支持。经过不懈努力，你找到了一位愿意资助你的赞助人。在他的支持下，你可以专注于艺术创作，你的作品质量得到了显著提高。';
      } else if (choice.includes('开始旅行')) {
        return '你开始旅行，寻找艺术灵感。你游览了许多国家和地区，接触到了不同的文化和风景。这些经历丰富了你的创作素材，你的作品开始展现出更加丰富的内涵。';
      }
    } else if (timeline >= 1914 && timeline <= 1918) {
      return [
        '你在战场上表现英勇，多次立功，很快获得了晋升。你的领导能力和军事才能得到了上级的认可，你成为了一名军官。战争结束后，你凭借在军队中的经历，开始了新的职业生涯。',
        '你专注于战地宣传工作，发挥你的艺术天赋。你创作了许多鼓舞士气的宣传画，成为了战地宣传的重要力量。你的作品在士兵中广为流传，提高了军队的士气。',
        '你尽可能躲避危险，保存自己的生命。你在战争中幸存下来，经历了战争的残酷，更加珍惜和平。战争结束后，你决定远离暴力和冲突，追求平静的生活。'
      ];
    } else if (timeline >= 1933 && timeline <= 1939) {
      return [
        '你加强军备，准备对外扩张。你的军事战略取得了一定的成功，但也引起了国际社会的警惕。随着紧张局势的加剧，战争的阴影逐渐笼罩欧洲。',
        '你专注于国内经济建设，改善民生。你实施了一系列经济改革，使德国的经济得到了快速发展，人民生活水平显著提高。德国在你的领导下，成为了欧洲的经济强国。',
        '你寻求与其他国家的和平合作，通过外交手段解决国际争端。你积极参与国际组织，推动欧洲的和平与合作。德国在你的领导下，成为了维护世界和平的重要力量。'
      ];
    } else if (timeline >= 1939 && timeline <= 1945) {
      return [
        '你集中力量进攻苏联，扩大东部战线。战争初期，你的军队取得了一些胜利，但随着时间推移，苏联的抵抗越来越顽强。最终，你的军队陷入了困境，战争形势开始逆转。',
        '你加强对英国的轰炸，迫使英国投降。尽管你发动了大规模的空袭，但英国人民的抵抗意志非常坚定。最终，你的轰炸行动未能达到预期的效果，英国仍然坚持抵抗。',
        '你寻求与盟军的和平谈判，希望结束战争。经过艰苦的谈判，你与盟军达成了和平协议，避免了更多的人员伤亡。战争结束后，你开始致力于国家的重建和和解。'
      ];
    } else if (timeline > 1945) {
      return [
        '你接受现实，开始新的生活。你隐姓埋名，过上了普通人的生活。你反思过去的经历，对自己的行为感到后悔。你决定用余生来弥补自己的过错，为社会做出贡献。',
        '你坚持自己的信念，继续为自己的理想奋斗。你秘密组织了一些支持者，试图恢复自己的影响力。但随着时间推移，你的努力逐渐失去了意义，你不得不接受现实。',
        '你反思过去，寻求赎罪和和解。你公开承认自己的错误，向受害者道歉。你致力于和平事业，反对战争和暴力。你的转变得到了一些人的理解和原谅，但也有人始终无法接受你的过去。'
      ];
    }

    // 默认结果
    return [
      '你的选择改变了你的人生轨迹，开启了一段新的旅程。你将面临新的挑战和机遇，你的未来充满了无限可能。',
      '你的决定影响了你的人生方向，你将踏上一条不同的道路。在这条道路上，你会遇到各种困难和挫折，但也会收获成功和快乐。',
      '你的选择是你人生中的一个重要转折点，它将带你走向一个全新的世界。无论结果如何，这都是你自己的选择，你需要勇敢地面对它。'
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
  async generateChoices(prompt, timeline, previousChoice = null) {
    try {
      if (this.useMock) {
        return this.getMockChoices(timeline, previousChoice).join('\n');
      }
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
      return this.getMockChoices(timeline, previousChoice).join('\n');
    }
  }

  // 生成结果
  async generateResult(prompt, timeline, choice) {
    try {
      if (this.useMock) {
        const results = this.getMockResults(choice, timeline);
        if (Array.isArray(results)) {
          return results[Math.floor(Math.random() * results.length)];
        } else {
          return results;
        }
      }
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
      const results = this.getMockResults(choice, timeline);
      if (Array.isArray(results)) {
        return results[Math.floor(Math.random() * results.length)];
      } else {
        return results;
      }
    }
  }

  // 生成结局
  async generateEnding(prompt) {
    try {
      if (this.useMock) {
        return this.getMockEndings()[Math.floor(Math.random() * this.getMockEndings().length)];
      }
      const content = await this.callOpenAI(prompt);
      return this.contentFilter.filterContent(content);
    } catch (error) {
      console.error('生成结局时出错:', error);
      return this.getMockEndings()[Math.floor(Math.random() * this.getMockEndings().length)];
    }
  }
}

export default AIService;
