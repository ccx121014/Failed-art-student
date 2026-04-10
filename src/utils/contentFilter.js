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

  validateContent(content) {
    if (!content) return false;

    for (const keyword of this.sensitiveKeywords) {
      if (content.toLowerCase().includes(keyword.toLowerCase())) {
        return false;
      }
    }

    return true;
  }
}

export default ContentFilter;
