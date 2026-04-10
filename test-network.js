import http from 'http';
import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

function testConnection(url) {
  console.log(`测试连接到: ${url}`);
  
  const options = new URL(url);
  const protocol = options.protocol === 'https:' ? https : http;
  
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  const reqOptions = {
    hostname: options.hostname,
    port: options.port,
    path: options.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey ? 'Bearer ' + apiKey : 'Bearer test_key'
    }
  };
  
  const req = protocol.request(reqOptions, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.on('data', (chunk) => {
      console.log(`响应数据: ${chunk}`);
    });
  });
  
  req.on('error', (e) => {
    console.error(`连接错误: ${e.message}`);
  });
  
  // 发送请求体
  const postData = JSON.stringify({
    model: "deepseek-ai/deepseek-v3.2",
    messages: [{"role":"user","content":"你好，测试连接"}],
    temperature: 1,
    max_tokens: 100
  });
  
  req.write(postData);
  req.end();
}

// 测试具体的API端点
testConnection('https://integrate.api.nvidia.com/v1/chat/completions');
