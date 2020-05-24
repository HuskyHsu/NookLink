const furnitures = require('../data/furniture.json');
const recipes = require('../data/recipes.json');

const furniture = require('../items/furniture');
const query = require('../lib/query');
const template = require('../lib/template');

const queryTypeMap = {
    'tag': ['tag'],
    '主題': ['themes'],
    '取得方式': ['obtainedFrom'],
    '查詢': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes'],
    'diy': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes']
}

async function page(context, type, target) {

    let = attrs = queryTypeMap[type];
    let itemList = [];

    let itemType = [furnitures, recipes];
    itemType.forEach((type) => {
        itemList = [...itemList, ...query.filter(type, attrs, target)]
    })

    itemList = itemList.filter((thing, index, self) => {
        return index === self.findIndex((t) => (
        t.name_c === thing.name_c
        ))
    })

    if (type === 'diy') {
        itemList = itemList.filter((item, index) => {
            return item.DIY || Array.isArray(item.materials)
        })
    }
	
	if (itemList.length == 0) {
        return null
    }

	if (itemList.length === 1) {
        if (['家具', '小物件', '壁掛物'].indexOf(itemList[0].category) > -1) {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, furniture.info(itemList[0]));
        } else {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, template.info(itemList[0]));
        }
	} else if (itemList.length <= 3*3*3) {
		await context.sendFlex('物品清單', template.list(itemList, 3, 3));
	} else if (itemList.length <= 3*3*6) {
        await context.sendFlex('物品清單', template.simpleList(itemList));
	} else {
        let r = itemList.map((item) => `${item.name_c}${item.obtainedFrom === 'DIY' ? '(DIY)' : ''}`).join('\n');
        await context.sendText(`共計${itemList.length}筆資料\n\n${r}`);
    }

}

async function filter(context) {
    const [type, name] = context.event.text.split('-');
    if (name === 'Nook商店') {
        return await context.sendText('符合物品數量龐大，不開放查詢清單 (シ_ _)シ');
    }

    page(context, type.toLowerCase(), name.toLowerCase());
}

async function image(context, name, filename) {
    await context.send([{
            type: 'text',
            text: name,
        },
        {
            type: 'image',
            originalContentUrl: `https://acnhcdn.com/latest/FtrIcon/${filename}.png`,
            previewImageUrl: `https://acnhcdn.com/latest/FtrIcon/${filename}.png`
        },
    ]);
}

module.exports.filter = filter;
module.exports.image = image;