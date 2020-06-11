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

	const commandItem = `【家具、DIY、藝術品、居民類】
查詢 [物品名稱]\n➡ 查詢物品、居民、藝術品資訊\n
tag [tag名稱]\n➡ 查詢含該tag之家具清單\n
主題 [主題名稱]\n➡ 查詢含該主題之家具清單\n
取得方式 [取得方式]\n➡ 查詢該取得方式之清單\n
DIY [DIY關鍵字]\n➡ 查詢DIY物品、來源、活動\n
材料 [材料關鍵字]\n➡ 查詢該材料可製作DIY清單\n
種族 [種族類別]\n➡ 查詢該種族之居民清單\n
個性 [個性類別]\n➡ 查詢該個性之居民清單\n
表情 [個性類別]\n➡ 查詢該個性可學表情之清單`

	const commandFish = `【魚/蟲圖鑑類】
魚/蟲\n➡ 當月彙整魚/蟲圖鑑\n
魚/蟲 [數字]月\n➡ 指定月份彙整魚/蟲圖鑑\n
魚/蟲 [名稱(中、英、日、編號)]\n➡ 該魚/蟲詳細資料`

    await context.send([{
			type: 'text',
			text: commandItem,
		}, {
			type: 'text',
			text: commandFish,
		}
	]);
}

async function problemReport(context) {
	await context.sendText('https://forms.gle/FuVb42d1XVeLJMHbA');
}

async function Unknown(context) {
	await context.sendText(context.event.text);
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

	text(new RegExp(`^查詢[-\\s](${items.getAllNames('furnitures')})$`, 'i'), items.info('furnitures')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('recipes')})$`, 'i'), items.info('recipes')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('arts')})$`, 'i'), items.info('arts')),
	text(new RegExp(`^查詢[-\\s](${items.getAllNames('villagers')})$`, 'i'), items.info('villagers')),

	text(new RegExp(`^(查詢|tag|主題|取得方式|材料|DIY|種族|個性|表情)[-\\s].*$`, 'i'), items.filter),

	text('指令集', command),
	text('意見回報', problemReport),

	// text('現在時刻', Unknown),

	line.postback(HandlePostback)
  ]);
}