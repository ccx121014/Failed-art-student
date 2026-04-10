import { OpenAI } from 'openai';
import ContentFilter from '../utils/contentFilter.js';
import Cache from '../utils/cache.js';

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

  async generateChoices(prompt, timeline = 1907) {
    // 检查缓存
    const cacheKey = `choices_${prompt.hashCode()}_${timeline}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockChoices = this.getMockChoices(timeline);
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
      const mockChoices = this.getMockChoices(timeline);
      const filteredContent = this.contentFilter.filterContent(mockChoices);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }
  }

  async generateResult(prompt, timeline = 1907) {
    // 检查缓存
    const cacheKey = `result_${prompt.hashCode()}_${timeline}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockResult = this.getMockResult(timeline);
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
      const mockResult = this.getMockResult(timeline);
      const filteredContent = this.contentFilter.filterContent(mockResult);
      this.cache.set(cacheKey, filteredContent);
      return filteredContent;
    }
  }

  async generateEnding(prompt, timeline = 1907) {
    // 检查缓存
    const cacheKey = `ending_${prompt.hashCode()}_${timeline}`;
    const cachedResult = this.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    if (this.useMock) {
      const mockEnding = this.getMockEnding(timeline);
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
      const mockEnding = this.getMockEnding(timeline);
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

  getMockChoices(timeline) {
    let choiceSets = [];
    
    if (timeline === 1907) {
      choiceSets = [
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
    } else if (timeline >= 1914 && timeline <= 1918) {
      choiceSets = [
        [
          '在战场上表现英勇，争取晋升机会',
          '专注于战地宣传工作，发挥你的艺术天赋',
          '尽可能躲避危险，保存自己的生命'
        ],
        [
          '与战友建立深厚的友谊',
          '学习军事战略和战术',
          '思考战争的意义和未来的和平'
        ],
        [
          '积极参与战斗，争取立功受奖',
          '利用业余时间继续创作艺术作品',
          '开始撰写战争日记，记录战争经历'
        ]
      ];
    } else if (timeline >= 1933 && timeline <= 1939) {
      choiceSets = [
        [
          '加强军备，准备对外扩张',
          '专注于国内经济建设，改善民生',
          '寻求与其他国家的和平合作'
        ],
        [
          '推行民族主义政策，增强国家凝聚力',
          '发展科技和教育，提高国家竞争力',
          '与周边国家建立友好关系，避免冲突'
        ],
        [
          '扩大纳粹党的影响力，巩固统治',
          '投资基础设施建设，创造就业机会',
          '参与国际裁军谈判，维护世界和平'
        ]
      ];
    } else if (timeline >= 1939 && timeline <= 1945) {
      choiceSets = [
        [
          '集中力量进攻苏联，扩大东部战线',
          '加强对英国的轰炸，迫使英国投降',
          '寻求与盟军的和平谈判'
        ],
        [
          '优先发展新型武器，如V-2火箭',
          '加强对占领区的管理，稳定后方',
          '调整军事战略，集中力量防御'
        ],
        [
          '加强与日本的合作，协同作战',
          '动员国内资源，支持战争',
          '考虑投降，避免更多人员伤亡'
        ]
      ];
    } else if (timeline > 1945) {
      choiceSets = [
        [
          '接受现实，开始新的生活',
          '坚持自己的信念，继续为自己的理想奋斗',
          '反思过去，寻求赎罪和和解'
        ],
        [
          '隐姓埋名，过普通人的生活',
          '逃往国外，寻求政治庇护',
          '公开道歉，寻求社会的原谅'
        ],
        [
          '致力于和平事业，反对战争',
          '撰写回忆录，记录自己的经历',
          '参与战后重建，为社会做出贡献'
        ]
      ];
    }

    if (choiceSets.length === 0) {
      choiceSets = [
        [
          '继续追求艺术梦想，在维也纳街头卖画为生',
          '寻找其他职业道路，比如成为一名建筑师',
          '返回故乡奥地利，帮助父亲管理农场'
        ]
      ];
    }

    const randomSet = choiceSets[Math.floor(Math.random() * choiceSets.length)];
    return randomSet.join('\n');
  }

  getMockResult(timeline) {
    let results = [];
    
    if (timeline === 1907) {
      results = [
        '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。',
        '你选择寻找其他职业道路，成为一名建筑师。你利用自己的艺术天赋，设计了许多独特的建筑作品。你的设计风格融合了古典与现代元素，受到了广泛好评。随着时间推移，你成为了一名知名的建筑师，参与了许多重要建筑的设计。',
        '你返回故乡奥地利，帮助父亲管理农场。虽然远离了艺术，但你在农场的生活中找到了新的乐趣。你开始研究农业技术，改进种植方法，使农场的产量大幅提高。你的成功引起了当地政府的注意，邀请你参与农业改革项目。',
        '你加入了维也纳的艺术团体，结识了许多志同道合的朋友。在他们的鼓励和帮助下，你的艺术水平得到了很大提高。你开始尝试不同的艺术风格，逐渐形成了自己独特的艺术语言。你的作品开始在当地的艺术展览中展出。',
        '你前往慕尼黑发展，那里的艺术氛围更浓厚。在慕尼黑，你接触到了更多的艺术流派和思想，开阔了自己的视野。你开始尝试现代艺术风格，创作了一系列具有争议性的作品。这些作品引起了艺术界的关注，你逐渐在慕尼黑艺术圈崭露头角。',
        '你尝试报考其他艺术学院，如柏林艺术学院。经过充分准备，你成功被录取。在学院里，你接受了系统的艺术教育，艺术技巧得到了很大提升。你开始参加各种艺术比赛和展览，获得了一些奖项。毕业后，你成为了一名职业艺术家。',
        '你开始学习政治，关注社会问题。你对当时的社会现状感到不满，开始撰写文章表达自己的观点。你的文章引起了一些人的关注，你逐渐成为了一名政治活动家。你开始组织集会和演讲，宣传自己的政治理念。',
        '你成为一名艺术评论家，用笔杆子表达自己的观点。你的评论文章犀利而有见地，受到了读者的欢迎。你开始为一些知名艺术杂志撰稿，成为了一名知名的艺术评论家。你的评论对艺术界产生了一定的影响。',
        '你离开欧洲，前往美国寻求新的机会。在美国，你面临着新的挑战和机遇。你开始在纽约的艺术圈发展，接触到了更多的艺术形式和思想。你逐渐适应了美国的生活，成为了一名在美国发展的艺术家。'
      ];
    } else if (timeline >= 1914 && timeline <= 1918) {
      results = [
        '你在战场上表现英勇，多次立功受奖，被晋升为下士。你在战争中展现出了出色的领导能力，赢得了战友的尊重和上级的赏识。战争结束后，你被授予铁十字勋章，成为了一名战争英雄。',
        '你专注于战地宣传工作，发挥你的艺术天赋，创作了许多鼓舞士气的宣传画和海报。你的作品在军队中广泛传播，极大地提高了士兵的士气。你成为了一名知名的战地艺术家，你的作品被视为战争时期的重要文化遗产。',
        '你尽可能躲避危险，保存自己的生命。虽然你没有在战争中表现突出，但你活了下来，见证了战争的残酷和破坏。战争结束后，你对战争产生了深深的厌恶，开始致力于和平事业。',
        '你与战友建立了深厚的友谊，这些友谊在战争中给了你巨大的支持和力量。你和战友们互相帮助，共同度过了战争的艰难岁月。战争结束后，你与这些战友保持着联系，成为了一生的朋友。',
        '你学习军事战略和战术，展现出了出色的军事天赋。你开始撰写军事理论文章，提出了一些创新的战略思想。战争结束后，你成为了一名军事理论家，你的思想对后来的军事发展产生了一定的影响。',
        '你思考战争的意义和未来的和平，开始撰写关于战争与和平的文章。你的文章深刻分析了战争的原因和影响，提出了实现和平的建议。战争结束后，你成为了一名和平主义者，致力于推动国际和平与合作。'
      ];
    } else if (timeline >= 1933 && timeline <= 1939) {
      results = [
        '你加强军备，准备对外扩张。德国的军事实力迅速增强，成为了欧洲最强大的军事力量之一。你的扩张政策导致了与其他国家的紧张关系，最终引发了第二次世界大战。',
        '你专注于国内经济建设，改善民生。德国的经济迅速恢复和发展，失业率大幅下降，人民生活水平显著提高。你赢得了德国人民的广泛支持，成为了一名受欢迎的领导人。',
        '你寻求与其他国家的和平合作，积极参与国际事务，推动欧洲的和平与稳定。你与周边国家建立了友好关系，避免了冲突的发生。德国在你的领导下成为了欧洲的重要和平力量。',
        '你推行民族主义政策，增强国家凝聚力。德国的民族自豪感和国家认同感得到了极大的提升，人民的爱国热情高涨。你成为了德国民族的象征，受到了人民的狂热崇拜。',
        '你发展科技和教育，提高国家竞争力。德国在科技和教育领域取得了显著成就，培养了大量优秀人才。德国成为了世界科技和教育的领先国家之一。',
        '你与周边国家建立友好关系，避免冲突。你通过外交手段解决了与邻国的争端，维护了地区的和平与稳定。德国在你的领导下成为了欧洲的和平使者。'
      ];
    } else if (timeline >= 1939 && timeline <= 1945) {
      results = [
        '你集中力量进攻苏联，扩大东部战线。德军在初期取得了重大胜利，但随着战争的进行，苏军的抵抗越来越顽强。最终，德军在斯大林格勒战役中遭受了惨败，开始走向衰落。',
        '你加强对英国的轰炸，迫使英国投降。德军对英国进行了大规模的轰炸，给英国造成了巨大的损失。但英国人民在丘吉尔的领导下顽强抵抗，最终挫败了德军的进攻。',
        '你寻求与盟军的和平谈判，希望结束战争。但盟军要求德国无条件投降，谈判破裂。战争继续进行，最终德国战败。',
        '你优先发展新型武器，如V-2火箭。这些新型武器在战争中发挥了一定的作用，但未能改变战争的结局。战后，这些技术被用于和平目的，推动了科技的发展。',
        '你加强对占领区的管理，稳定后方。你在占领区实施了严格的统治，维持了后方的稳定。但这些措施也引起了当地人民的反抗，加剧了战争的残酷性。',
        '你调整军事战略，集中力量防御。德军在战争后期采取了防御战略，试图阻止盟军的进攻。但由于实力悬殊，最终未能阻止德国的战败。'
      ];
    } else if (timeline > 1945) {
      results = [
        '你接受现实，开始新的生活。你隐姓埋名，过着普通人的生活，逐渐淡出了公众的视野。你反思自己的过去，对自己的行为感到后悔。你度过了平静的余生，最终在默默无闻中去世。',
        '你坚持自己的信念，继续为自己的理想奋斗。你组织了地下活动，试图恢复纳粹党的影响力。但这些活动最终被当局发现，你被逮捕并判处监禁。你在监狱中度过了余生。',
        '你反思过去，寻求赎罪和和解。你公开道歉，承认自己的错误，致力于弥补自己的罪行。你参与了战后重建工作，为社会做出了一定的贡献。你的努力得到了部分人的理解和原谅。',
        '你隐姓埋名，过普通人的生活。你改名换姓，搬到了一个新的地方，开始了新的生活。你努力融入当地社会，与过去的自己彻底决裂。你过上了平静而普通的生活。',
        '你逃往国外，寻求政治庇护。你逃离了德国，前往一个愿意接纳你的国家。你在国外继续宣扬自己的理念，但影响力已经大不如前。你在国外度过了余生。',
        '你公开道歉，寻求社会的原谅。你在媒体上公开承认自己的错误，表达了深深的悔恨。你致力于和平事业，反对战争和暴力。你的努力得到了一些人的认可，但也遭到了许多人的质疑。'
      ];
    }

    if (results.length === 0) {
      results = [
        '你决定继续追求艺术梦想，在维也纳街头卖画为生。虽然生活清苦，但你坚持创作，逐渐在当地小有名气。一些艺术收藏家开始注意到你的作品，你的画作价格逐渐上涨。几年后，你举办了自己的第一次个人画展，获得了艺术界的认可。'
      ];
    }

    return results[Math.floor(Math.random() * results.length)];
  }

  getMockEnding(timeline) {
    let endings = [];
    
    if (timeline === 1907) {
      endings = [
        '你的人生轨迹与真实历史截然不同。你成为了一名成功的艺术家，以自己的作品闻名于世。你的艺术风格独特，对后世产生了深远的影响。你过着平静而充实的生活，享年85岁。在你去世后，你的作品被许多博物馆收藏，成为艺术史上的重要遗产。',
        '你的人生充满了波折和挑战，但你始终坚持自己的信念。你成为了一名杰出的建筑师，设计了许多标志性建筑。你的作品不仅美观，而且实用，为人们的生活带来了便利。你被认为是20世纪最伟大的建筑师之一，你的名字将永远被人们铭记。',
        '你选择了一条与艺术完全不同的道路，但你同样取得了成功。你成为了一名杰出的农业专家，为当地的农业发展做出了重要贡献。你的创新方法提高了农作物的产量，帮助许多农民摆脱了贫困。你被视为农业改革的先驱，受到了人们的尊敬和爱戴。',
        '你的人生充满了艺术的气息。你成为了一名知名的艺术评论家，你的评论文章影响了许多艺术家的创作。你还培养了许多年轻的艺术家，为艺术界注入了新的活力。你的贡献被艺术界广泛认可，你被誉为艺术界的良心。',
        '你选择了政治道路，成为了一名有影响力的政治人物。你的政治理念关注民生，致力于改善普通民众的生活。你通过和平手段推动社会改革，赢得了人们的支持和信任。你成为了一名受人尊敬的政治家，为国家的发展做出了重要贡献。'
      ];
    } else if (timeline >= 1914 && timeline <= 1918) {
      endings = [
        '你的人生因为第一次世界大战而改变。你在战争中表现英勇，成为了一名战争英雄。战后，你利用自己的声望进入政界，成为了一名有影响力的政治家。你致力于维护和平，防止战争的再次发生。你被人们视为和平的守护者，你的名字被历史铭记。',
        '你在战争中幸存下来，但战争的创伤深深地影响了你。你开始致力于反战运动，成为了一名和平主义者。你撰写了许多关于战争残酷性的文章和书籍，呼吁人们珍惜和平。你的努力为世界和平做出了重要贡献。',
        '你在战争中展现出了出色的军事天赋，战后成为了一名军事将领。你致力于军队的现代化建设，提高了国家的国防能力。你被视为国家的保护者，受到了人们的尊敬和爱戴。',
        '你在战争中发挥了自己的艺术天赋，成为了一名知名的战地艺术家。你的作品真实地记录了战争的残酷和士兵的苦难，引起了人们对战争的反思。你的作品成为了战争时期的重要文化遗产，对后世产生了深远的影响。',
        '你在战争中与战友建立了深厚的友谊，战后与他们一起创建了一个退伍军人组织，为退伍军人提供帮助和支持。你致力于改善退伍军人的生活条件，为他们争取权益。你的努力得到了社会的广泛认可。'
      ];
    } else if (timeline >= 1933 && timeline <= 1939) {
      endings = [
        '你成为了德国的领导人，带领德国走向了繁荣和强大。你通过和平手段解决国际争端，避免了战争的发生。德国在你的领导下成为了欧洲的和平力量，你被视为伟大的和平缔造者。你的名字被历史铭记，成为了德国历史上的传奇人物。',
        '你选择了扩张政策，导致了第二次世界大战的爆发。德国在战争中遭受了惨败，你也为此付出了惨重的代价。你的名字成为了战争和灾难的象征，被历史所谴责。',
        '你专注于国内建设，使德国成为了一个经济强国。你改善了人民的生活条件，提高了国家的国际地位。你被视为德国的伟大领导者，你的政策对德国的发展产生了深远的影响。',
        '你推行了民族主义政策，增强了德国的民族凝聚力。但你的政策也导致了与其他国家的紧张关系，最终引发了冲突。你的名字在历史上褒贬不一，成为了一个有争议的人物。',
        '你致力于科技和教育的发展，使德国成为了世界科技的领先国家。你的政策培养了大量优秀人才，为德国的未来发展奠定了基础。你被视为德国科技和教育的推动者，受到了人们的尊敬。'
      ];
    } else if (timeline >= 1939 && timeline <= 1945) {
      endings = [
        '你领导德国参与了第二次世界大战，最终遭受了惨败。德国被盟军占领，你也为此付出了生命的代价。你的名字成为了战争、暴力和仇恨的象征，被历史所唾弃。',
        '你在战争中意识到了自己的错误，寻求与盟军的和平谈判。你成功地结束了战争，避免了更多的人员伤亡。你为自己的错误道歉，致力于战后重建。你的努力得到了部分人的理解和原谅，成为了一个有争议但也有救赎的人物。',
        '你在战争中展现出了出色的军事才能，但最终无法改变德国战败的命运。你在战争结束后被盟军逮捕，接受了审判。你的军事才能被人们所认可，但你的战争罪行也被历史所记录。',
        '你在战争中优先发展科技，推动了许多重要技术的发展。这些技术在战后被用于和平目的，对人类社会的发展做出了贡献。你的科技政策被视为你的重要遗产，尽管你的战争政策受到了谴责。',
        '你在战争中试图通过外交手段结束冲突，但未能成功。德国最终战败，你也在战争结束后去世。你的和平努力被人们所铭记，成为了历史上一个复杂而悲剧性的人物。'
      ];
    } else if (timeline > 1945) {
      endings = [
        '你在战后开始了新的生活，隐姓埋名，远离政治。你反思自己的过去，对自己的行为感到深深的后悔。你过着平静的余生，最终在默默无闻中去世。你的故事成为了历史的一个教训，提醒人们战争和仇恨的危害。',
        '你在战后公开道歉，承认自己的错误，致力于和平事业。你参与了战后重建工作，为社会做出了一定的贡献。你的努力得到了部分人的理解和原谅，成为了一个有救赎精神的人物。',
        '你在战后逃往国外，寻求政治庇护。你在国外继续宣扬自己的理念，但影响力已经大不如前。你在国外度过了余生，成为了一个被历史遗忘的人物。',
        '你在战后被盟军逮捕，接受了审判，被判处监禁。你在监狱中反思自己的过去，对自己的行为感到后悔。你在监狱中度过了余生，最终在监狱中去世。你的故事成为了历史的一个警示。',
        '你在战后致力于和平事业，反对战争和暴力。你撰写了许多关于和平的文章和书籍，呼吁人们珍惜和平。你的努力为世界和平做出了一定的贡献，成为了一个和平的倡导者。'
      ];
    }

    if (endings.length === 0) {
      endings = [
        '你的人生轨迹与真实历史截然不同。你成为了一名成功的艺术家，以自己的作品闻名于世。你的艺术风格独特，对后世产生了深远的影响。你过着平静而充实的生活，享年85岁。在你去世后，你的作品被许多博物馆收藏，成为艺术史上的重要遗产。'
      ];
    }

    return endings[Math.floor(Math.random() * endings.length)];
  }
}

export default AIInterface;
