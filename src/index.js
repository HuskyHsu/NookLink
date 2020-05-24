const { router, text, line } = require('bottender/router');
const fish = require('./museum/fish');
const insect = require('./museum/insect');
const furniture = require('./items/furniture');
const items = require('./items/index');
const querystring = require('querystring');

async function SayHi(context) {
  	await context.sendText('Hi!');
}

async function command(context) {
	await context.sendText('痾');
}

async function problemReport(context) {
	await context.sendText('https://forms.gle/FuVb42d1XVeLJMHbA');
}


async function HandlePostback(context) {
	let postback = querystring.parse(context.event.postback.data);
	if (postback.type = 'fig') {
		items.image(context, postback.name, postback.fileName)
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

	text(new RegExp(`^查詢-(${furniture.getAllNames()})$`, 'i'), furniture.detail),
	text(new RegExp(`^(查詢|tag|主題|取得方式|DIY)-.*$`, 'i'), items.filter),

	text('指令集', command),
	text('意見回報', problemReport),

	line.postback(HandlePostback)
  ]);
}