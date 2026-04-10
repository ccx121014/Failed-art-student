const dotenv = require('dotenv');
dotenv.config();

const GameEngine = require('./src/game/engine');

async function main() {
  console.log('落榜美术生（希特勒）模拟器');
  console.log('==================================');
  console.log('模拟阿道夫·希特勒在1907年艺术学院落榜后的人生选择');
  console.log('通过不同的选择，探索可能的历史轨迹');
  console.log('==================================\n');

  const game = new GameEngine();
  await game.start();
}

main().catch(console.error);
