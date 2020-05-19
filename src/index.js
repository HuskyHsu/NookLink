const { router, text } = require('bottender/router');
const fish = require('./museum/fish');
const insect = require('./museum/insect');
const furniture = require('./items/furniture');
const items = require('./items/index');

const furnituresJson = require('./data/furniture.json');
const query = require('./lib/query');
const template = require('./lib/template');

async function SayHi(context) {
  	await context.sendText('Hi!');
}

async function Unknown(context) {

}

module.exports = async function App() {
  return router([
	text('hi', SayHi),
	
	text('魚', fish.currentFish),
	text(/^魚-(\d{1,2})月$/i, fish.currentFish),
	text(new RegExp(`^魚-(${fish.getAllNames()})$`, 'i'), fish.detail),

	text('蟲', insect.currentInsect),
	text(/^蟲-(\d{1,2})月$/i, insect.currentInsect),
	text(new RegExp(`^蟲-(${insect.getAllNames()})$`, 'i'), insect.detail),

	text(new RegExp(`^家具-(${furniture.getAllNames()})$`, 'i'), furniture.detail),

	text(new RegExp(`^(家具|tag|主題|取得方式|DIY)-.*$`, 'i'), items.filter),

	text('*', Unknown),
  ]);
}