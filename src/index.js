const { router, text } = require('bottender/router');
const fish = require('./museum/fish');
const insect = require('./museum/insect');
const furniture = require('./furniture/index');
const furnituresJson = require('./data/furniture.json');
const query = require('./lib/query');
const template = require('./lib/template');

async function SayHi(context) {
  	await context.sendText('Hi!');
}

async function Unknown(context) {
	// let itemListTemplate = require('./template/item_list.json');
	let [itemType, itemName] = context.event.text.split('-');
	let itemList = [];
	if (itemType === '家具') {
		itemList = [...itemList, ...query.filter(furnituresJson, ['name_c', 'name_e', 'name_j'], itemName)]
	} else if (itemType === '取得方式') {
		itemList = [...itemList, ...query.filter(furnituresJson, ['obtainedFrom'], itemName)]
	}

	if (itemList.length > 0) {
		if (itemList.length === 1) {
			await context.sendFlex('物品清單', furniture.info(itemList[0]));
		} else if (itemList.length <= 3*3*3) {
			await context.sendFlex('物品清單', template.list(itemList, 3, 3, '家具'));
		} else {
			let r = itemList.map((item) => item.name_c).join('\n');
			await context.sendText(`數量過多，請增加條件\n\n${r}`);
		}
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

	text(new RegExp(`^取得方式-呂遊$`, 'i'), Unknown),
	text('*', Unknown),
  ]);
}