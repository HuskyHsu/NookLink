const furnitures = require('../data/furnitures.json');
const recipes = require('../data/recipes.json');
const arts = require('../data/art.json');
const villagers = require('../data/villagers.json');
const reactions = require('../data/reactions.json');
const clothes = require('../data/clothes.json');
const homeStyle = require('../data/homeStyle.json');
const tools = require('../data/tools.json');

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
    'tools': tools,
}

const queryTypeMap = {
    'tag': ['tag'],
    '主題': ['themes'],
    '系列': ['series'],
    '取得方式': ['obtainedFrom'],
    '查詢': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'diyInfoObtainedFrom', 'sourceNotes', 'realArtworkTitle', 'realArtworkTitle_tw'],
    'diy': ['name_c', 'name_e', 'name_j', 'obtainedFrom', 'diyInfoObtainedFrom', 'sourceNotes'],
    '種族': ['species'],
    '個性': ['personality'],
    '材料': ['diyInfoMaterials', 'materials'],
    '表情': ['obtainedFrom'],
    '版本': ['version']
}

function removeMeta(obj) {
  for(prop in obj) {
    if (prop === 'action')
      delete obj[prop];
    else if (typeof obj[prop] === 'object')
      removeMeta(obj[prop]);
  }
}

function addShareButton(name, flexJson) {
    const shareButton =  {
        "type": "box",
        "layout": "horizontal",
        "contents": [
            {
                "type": "text",
                "text": "SHARE",
                "color": "#FFFFFF",
                "align": "center",
                "size": "xxs",
                "action": {
                    "type": "uri",
                    "label": "action",
                    "uri": `https://liff.line.me/1654527933-XoaQMeB5?type=查詢&name=${encodeURI(name)}`,
                    "altUri": {
                        "desktop": `https://liff.line.me/1654527933-XoaQMeB5?type=查詢&name=${encodeURI(name)}`
                    }
                }
            }
        ],
        "width": "50px",
        "position": "absolute",
        "backgroundColor": "#AE8F0099",
        "cornerRadius": "10px",
        "paddingAll": "5px",
        "offsetTop": "5px",
        "offsetEnd": "5px"
    }

    if (flexJson.type === 'bubble') {
        flexJson.header.contents.push(shareButton);
    } else if (flexJson.type === 'carousel') {
        flexJson.contents[0].header.contents.push(shareButton);
    }
}

const getAllNames = (type) => {
    return query.getAllNames(dataMap[type])
}

function flex(name) {
    let flexJson = null;
    
    let typeList = [
        'furnitures',
        'recipes',
        'arts',
        'villagers',
        'clothes',
        'homeStyle',
    ];
    
    typeList.forEach((type) => {
        const item = query.findOne(dataMap[type], name);
        if (typeof item !== 'undefined' && flexJson === null) {
            flexJson = template.info[type](item)
        }
    })

    removeMeta(flexJson)
    return {
        "type": "flex",
        "altText": name,
        "contents": flexJson
    }
}

function info(type) {
    return async function(context) {
        const itemName = context.event.text.split(/[\s]/).splice(1).join(' ');
        const item = query.findOne(dataMap[type], itemName);
        const flexJson = template.info[type](item);
        addShareButton(item.name_c, flexJson);

        ga.gaEventLabel(context.session.user.id, 'info', type, itemName);
        await context.sendFlex(`${itemName} 詳細資料`, flexJson);
    }
}

async function page(context, type, target) {

    let attrs = queryTypeMap[type];
    let itemList = [];

    let itemType = [furnitures, clothes, homeStyle, tools, arts, villagers, recipes, reactions];
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
        const flexJson = template.info[itemList[0].type](itemList[0]);
        addShareButton(itemList[0].name_c, flexJson);
        await context.sendFlex(`${itemList[0].name_c} 詳細資料`, flexJson);
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
    let [type, name] = [context.event.text.split(/[-\s]/).splice(0, 1)[0], context.event.text.split(/[-\s]/).splice(1).join(' ')];
    if (['Nook商店', '裁縫店', '無'].indexOf(name) > -1) {
        return await context.sendText('符合物品數量龐大，不開放查詢清單 (シ_ _)シ');
    } else if (type === '上次更新新增') {
        type = '版本'
        name = '1.4.0'
    }

    page(context, type.toLowerCase(), name.toLowerCase());
}

async function image(context, name, filename) {
    let fileUrl = `https://acnhcdn.com/latest/FtrIcon/${filename}.png`;
    if (filename.startsWith('https')) {
        fileUrl = filename
    }
    ga.gaEventLabel(context.session.user.id, 'image', '-', name);
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
module.exports.flex = flex;