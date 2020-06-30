const furnitures = require('../data/furniture.json');
const recipes = require('../data/recipes.json');
const arts = require('../data/art.json');
const villagers = require('../data/villagers.json');
const reactions = require('../data/reactions.json');
const clothes = require('../data/clothes.json');
const homeStyle = require('../data/homeStyle.json');
const equippables = require('../data/equippables.json');

const query = require('../lib/query');
const template = require('../lib/template');
const ga = require('../lib/ga');

const dataMap = {
    'furnitures': furnitures,
    'recipes': recipes,
    'arts': arts,
    'villagers': villagers,
    'clothes': clothes,
    'homeStyle': homeStyle,
    'equippables': equippables
}

const queryTypeMap = {
    'tag': ['tag'],
    '主題': ['themes'],
    '取得方式': ['obtainedFrom'],
    '查詢': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes', 'realArtworkTitle', 'realArtworkTitle_tw'],
    'diy': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'sourceNotes'],
    '種族': ['species'],
    '個性': ['personality'],
    '材料': ['diyInfoMaterials', 'materials'],
    '表情': ['obtainedFrom']
}

const getAllNames = (type) => {
    return query.getAllNames(dataMap[type])
}

function info(type) {
    return async function(context) {
        const itemName = context.event.text.split(/[\s]/).splice(1).join(' ');
        const item = query.findOne(dataMap[type], itemName);
        ga.gaEventLabel(context.session.user.id, 'info', type, itemName);
        await context.sendFlex(`${itemName} 詳細資料`, template.info[type](item));
    }
}

async function page(context, type, target) {

    let attrs = queryTypeMap[type];
    let itemList = [];

    let itemType = [furnitures, recipes, equippables, clothes, homeStyle, arts, villagers, reactions];
    itemType.forEach((set) => {
        itemList = [...itemList, ...query.filter(set, attrs, target)]
    })

    itemList = itemList.filter((thing, index, self) => {
        return index === self.findIndex((t) => (
            t.name_c === thing.name_c
        ))
    })

    if (type === 'diy') {
        itemList = itemList.filter((item) => {
            return item.DIY || Array.isArray(item.materials)
        })
    } else if (type === '表情') {
        itemList = itemList.filter((item) => {
            return item.type === 'reactions'
        })
    }
	
	if (itemList.length == 0) {
        return null
    }

    ga.gaEventLabel(context.session.user.id, 'query', type, target);
	if (itemList.length === 1) {
        await context.sendFlex(`${itemList[0].name_c} 詳細資料`, template.info[itemList[0].type](itemList[0]));
	} else if (itemList.length <= 4*4*4) {
		await context.sendFlex('符合清單', template.list(itemList, 4, 4));
	} else if (itemList.length <= 4*4*5) {
        await context.sendFlex('符合清單', template.simpleList(itemList));
	} else {
        let r = itemList.map((item) => `${item.name_c}${item.obtainedFrom === 'DIY' ? '(DIY)' : ''}`).join('\n');
        await context.sendText(`共計${itemList.length}筆資料\n\n${r}`);
    }

}

async function filter(context) {
    const [type, name] = [context.event.text.split(/[-\s]/).splice(0, 1)[0], context.event.text.split(/[-\s]/).splice(1).join(' ')];
    if (name === 'Nook商店' || name === '裁縫店') {
        return await context.sendText('符合物品數量龐大，不開放查詢清單 (シ_ _)シ');
    }

    page(context, type.toLowerCase(), name.toLowerCase());
}

async function image(context, name, filename) {
    let fileUrl = `https://acnhcdn.com/latest/FtrIcon/${filename}.png`;
    if (filename.startsWith('https')) {
        fileUrl = filename
    }
    ga.gaEventLabel(context.session.user.id, 'image', name, null);
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

module.exports.info = info;
module.exports.filter = filter;
module.exports.image = image;
module.exports.getAllNames = getAllNames;