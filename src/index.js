const { router, text } = require('bottender/router');
const fish = require('./museum/fish')

async function SayHi(context) {
  	await context.sendText('Hi!');
}


module.exports = async function App() {
  return router([
    text('hi', SayHi),
	text('魚', fish.currentFish),
	text('浪人鰺', fish.detail)
  ]);
}