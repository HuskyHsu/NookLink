const furnitures = require('../data/furniture.json');
const recipes = require('../data/recipes.json');
const arts = require('../data/art.json');
const villagers = require('../data/villagers.json');

const furniture = require('../items/furniture');
const query = require('../lib/query');
const template = require('../lib/template');

const queryTypeMap = {
    'tag': ['tag'],
    '主題': ['themes'],
    '取得方式': ['obtainedFrom'],
    '查詢': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes', 'realArtworkTitle', 'realArtworkTitle_tw'],
    'diy': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes']
}

async function page(context, type, target) {

    let = attrs = queryTypeMap[type];
    let itemList = [];

    let itemType = [furnitures, recipes, arts, villagers];
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
        if (itemList[0].type === 'furniture') {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, furniture.info(itemList[0]));
        } else if (itemList[0].type === 'DIY') {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, template.infoDiy(itemList[0]));
        } else if (itemList[0].type === 'art') {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, template.infoArt(itemList[0]));
        } else if (itemList[0].type === 'villagers') {
            await context.sendFlex(`${itemList[0].name_c} 詳細資料`, template.infoVillager(itemList[0]));
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
    const [type, name] = [context.event.text.split(/[-\s]/).splice(0, 1)[0], context.event.text.split(/[-\s]/).splice(1).join(' ')];
    if (name === 'Nook商店') {
        return await context.sendText('符合物品數量龐大，不開放查詢清單 (シ_ _)シ');
    }

    page(context, type.toLowerCase(), name.toLowerCase());
}

async function image(context, name, filename) {
    let fileUrl = `https://acnhcdn.com/latest/FtrIcon/${filename}.png`;
    if (filename.startsWith('https')) {
        fileUrl = filename
    }
    
    await context.send([{
            type: 'text',
            text: name,
        },
        {
            type: 'image',
            originalContentUrl:fileUrl,
            previewImageUrl: fileUrl
        }
    ]);
}

module.exports.filter = filter;
module.exports.image = image;