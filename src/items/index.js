const furnitures = require('../data/furniture.json');

const query = require('../lib/query');
const template = require('../lib/template');

async function page(context, attr, target) {
    let itemList = [];
    let itemType = [furnitures];

    itemType.forEach((type) => {
        itemList = [...itemList, ...query.filter(type, [attr], target)]
    })
	
	if (itemList.length > 0) {
		if (itemList.length <= 3*3*4) {
			await context.sendFlex('物品清單', template.list(itemList, 3, 3));
		} else if (itemList.length <= 3*3*9) {
            await context.sendFlex('物品清單', template.simpleList(itemList));
		} else {
            let r = itemList.map((item) => item.name_c).join('\n');
            await context.sendText(r);
        }
	}
}

async function tag(context) {
    const tagName = context.event.text.split('-')[1];
    page(context, 'tag', tagName);
}

async function themes(context) {
    const themeName = context.event.text.split('-')[1];
    page(context, 'themes', themeName);
}

async function obtainedFrom(context) {
    const fromName = context.event.text.split('-')[1];
    if (fromName === 'Nook商店') {
        await context.sendText('商店物品數量龐大，不開發查詢清單');
    } else {
        page(context, 'obtainedFrom', fromName);
    }
}

module.exports.tag = tag;
module.exports.themes = themes;
module.exports.obtainedFrom = obtainedFrom;