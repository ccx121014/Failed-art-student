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
    
    // 检测并过滤敏感内容
    for (const keyword of this.sensitiveKeywords) {
      if (filteredContent.toLowerCase().includes(keyword.toLowerCase())) {
        filteredContent = this.replaceSensitiveContent(filteredContent, keyword);
      }
    }

    // 检查内容是否符合道德标准
    if (!this.isContentAppropriate(filteredContent)) {
      return '内容不符合道德标准，已被过滤。';
    }

    return filteredContent;
  }

  replaceSensitiveContent(content, keyword) {
    // 简单的替换逻辑，实际项目中可能需要更复杂的处理
    const replacement = '*'.repeat(keyword.length);
    const regex = new RegExp(keyword, 'gi');
    return content.replace(regex, replacement);
  }

  isContentAppropriate(content) {
    // 检查内容是否包含不当内容
    const inappropriatePatterns = [
      /种族歧视|性别歧视|宗教歧视/g,
      /暴力描述|血腥场景/g,
      /仇恨言论|极端思想/g,
      /违法活动|犯罪行为/g
    ];

    for (const pattern of inappropriatePatterns) {
      if (pattern.test(content.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  validateChoice(choice) {
    // 验证选择是否合适
    if (!choice || choice.length === 0) {
      return false;
    }

    // 检查是否包含敏感内容
    for (const keyword of this.sensitiveKeywords) {
      if (choice.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
    }

    return true;
  }

  validateResult(result) {
    // 验证结果是否合适
    if (!result || result.length === 0) {
      return false;
    }

    // 检查是否包含敏感内容
    for (const keyword of this.sensitiveKeywords) {
      if (result.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
    }

    // 检查是否包含不当内容
    if (!this.isContentAppropriate(result)) {
      return false;
    }

    return true;
  }
}

module.exports = ContentFilter;
