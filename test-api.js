import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.DEEPSEEK_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  timeout: 30000 // 30秒超时
});

async function testAPIConnection() {
  console.log('正在测试API连接...');
  
  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek-ai/deepseek-v3.2",
      messages: [{"role":"user","content":"你好，测试连接"}],
      temperature: 1,
      top_p: 0.95,
      max_tokens: 100,
      stream: false
    });

    console.log('API连接成功！');
    console.log('响应:', completion.choices[0].message.content);
  } catch (error) {
    console.error('API连接失败:', error.message);
    if (error.status === 401) {
      console.error('认证错误：API密钥可能无效或已过期');
    } else if (error.status === 429) {
      console.error('速率限制：API调用过于频繁');
    } else if (error.status === 500) {
      console.error('服务器错误：API服务器出现问题');
    }
  }
}

testAPIConnection();
