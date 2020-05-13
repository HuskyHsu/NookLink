const { router, text } = require('bottender/router');
const fish = require('./museum/fish');
const insect = require('./museum/insect');
const furniture = require('./furniture/index');
const furnituresJson = require('./data/furniture.json');
const query = require('./lib/query');

async function SayHi(context) {
  	await context.sendText('Hi!');
}

async function Unknown(context) {
	const [itemType, itemName] = context.event.text.split('-');
	// let sendText = 'Sorry. I do not understand what you say.'
	if (itemType === '家具') {
		matchList = query.filter(furnituresJson, ['name_c', 'name_e', 'name_j'], itemName)
		if (matchList.length > 0) {
			sendText = matchList.map((item) => item.name_c).join('\n');
		}
		await context.sendText(sendText);
	}
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

	text('*', Unknown),
  ]);
}