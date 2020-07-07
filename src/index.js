const { router, text, line } = require('bottender/router');
const fish = require('./museum/fish');
const insect = require('./museum/insect');
const seaCreatures = require('./museum/seaCreatures');
const items = require('./items/index');
const { commands } = require('./lib/template');
const ga = require('./lib/ga');
const querystring = require('querystring');

async function SayHi(context) {
  	await context.sendText('Hi!');
}

async function command(context) {
	ga.gaEventLabel(context.session.user.id, 'command', '-', null);
	await context.sendFlex('指令集', commands());
}

async function problemReport(context) {
	ga.gaEventLabel(context.session.user.id, 'problemReport', '-', null);
	await context.sendText('https://forms.gle/FuVb42d1XVeLJMHbA');
}

async function Unknown(context) {
	ga.gaEventLabel(context.session.user.id, 'test', 'action', 'label');
	await context.sendText(context.session.user.id);
}

async function HandlePostback(context) {
	let postback = querystring.parse(context.event.postback.data);
	if (postback.type === 'fig') {
		items.image(context, postback.name, postback.fileName)
	}
}

module.exports = async function App() {
  return router([
	text('hi', SayHi),
	
	text('魚', fish.currentFish),
	text(/^魚[-\s](\d{1,2})月$/i, fish.currentFish),
	text(new RegExp(`^魚[-\\s](${fish.getAllNames()})$`, 'i'), fish.detail),

	text('蟲', insect.currentInsect),
	text(/^蟲[-\s](\d{1,2})月$/i, insect.currentInsect),
	text(new RegExp(`^蟲[-\\s](${insect.getAllNames()})$`, 'i'), insect.detail),

	text('海底生物', seaCreatures.currentSeaCreatures),

	text(new RegExp(`^查詢[-\\s](${items.getAllNames('furnitures')})$`, 'i'), items.info('furnitures')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('recipes')})$`, 'i'), items.info('recipes')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('arts')})$`, 'i'), items.info('arts')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('villagers')})$`, 'i'), items.info('villagers')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('clothes')})$`, 'i'), items.info('clothes')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('homeStyle')})$`, 'i'), items.info('homeStyle')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('equippables')})$`, 'i'), items.info('equippables')),

	text(new RegExp(`^(查詢|tag|主題|取得方式|材料|DIY|種族|個性|表情)[-\\s].*$`, 'i'), items.filter),

	text('指令集', command),
	text('意見回報', problemReport),

	text('test', Unknown),

	line.postback(HandlePostback)
  ]);
}