const furnitures = require('../data/furniture.json');
const query = require('../lib/query');
const style = require('../lib/style');

const getAllNames = () => {
    return query.getAllNames(furnitures)
}

const variations = (variation, filename, type, customize, title, name) => {
    let furniturevariationsTemplate = require('../template/furniture_variations.json');
    furniturevariationsTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    furniturevariationsTemplate.styles.body.backgroundColor = style.color.base.white;

    furniturevariationsTemplate.header.contents[0].text = `${type}差異` + (customize ? `(可改造-${title})` : '');

    const separator = {
        type: "separator"
    }
    let variations = {
        type: "box",
        layout: "vertical",
        contents: []
    }
    let bodyBoxs = Object.entries(variation).map((items) => {
        let filename_temp = `${filename.replace('0_0', '').replace('1_0', '')}${type !== '款式' ? '0_' : ''}${items[1]}${type !== '樣式' ? '_0' : ''}`;
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: `https://acnhcdn.com/latest/FtrIcon/${filename_temp}.png`,
                    size: "md",
                    action: {
                        type: 'postback',
                        label: 'fig',
                        data: `type=fig&name=${name}-${type}：${items[0]}&fileName=${filename_temp}`
                    }
                },
                {
                    type: "text",
                    text: items[0],
                    align: "center",
                    wrap: true,
                    size: "md"
                }
            ]
        }
    })

    const Hcount = bodyBoxs.length > 6 ? 3 : 2;

    let bodyBoxs_2 = [];
    while (bodyBoxs.length) {
        let boxs = {
            type: "box",
            layout: "horizontal",
            contents: []
        }
        boxs.contents = bodyBoxs.splice(0, Hcount);
        if (boxs.contents.length < Hcount) {
            const needCount = Hcount - boxs.contents.length;
            for (let i = 0; i < needCount; i++) {
                boxs.contents.push(
                    {
                        type: "text",
                        text: ' ',
                    }
                )
            }
        }
        bodyBoxs_2.push(boxs);
        if (bodyBoxs.length > 0) {
            bodyBoxs_2.push(separator);
        }
    }

    variations.contents = bodyBoxs_2;
    furniturevariationsTemplate.body.contents = [variations];

    return furniturevariationsTemplate
}

const info = (furniture) => {
    let furnitureDetailTemplate = require('../template/item_furniture.json');
    furnitureDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    furnitureDetailTemplate.styles.body.backgroundColor = style.color.base.white;

    furnitureDetailTemplate.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/FtrIcon/${furniture.filename}.png`;
    furnitureDetailTemplate.header.contents[0].contents[0].action.data = `type=fig&name=${furniture.name_c}&fileName=${furniture.filename}`;
    
    furnitureDetailTemplate.header.contents[0].contents[1].contents[0].text = furniture.name_c;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[1].text = furniture.name_j;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[2].text = furniture.name_e;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[3].text = `${furniture.category} / ${furniture.size}`;

    furnitureDetailTemplate.body.contents[0].contents[0].contents[1].text = furniture.buy === null ? '非賣品' : furniture.buy.toString();
    furnitureDetailTemplate.body.contents[0].contents[1].contents[1].text = furniture.sell.toString();
    furnitureDetailTemplate.body.contents[0].contents[2].contents[1].text = furniture.interact ? '可' : '不能'

    furnitureDetailTemplate.body.contents[0].contents[3].contents[1].text = furniture.tag;
    let tagAction = { 'type': 'message', 'label': 'Yes', 'text': `tag ${furniture.tag}` }
    furnitureDetailTemplate.body.contents[0].contents[3].contents[1].action = tagAction
    furnitureDetailTemplate.body.contents[0].contents[3].contents[1].color = style.color.base.blue;

    let themesSpan =  furniture.themes.map((theme) => {
        return {
            type: "text",
            text: theme,
            color: style.color.base.blue,
            size: "md",
            align: "center",
            wrap: true,
            action: { 'type': 'message', 'label': 'Yes', 'text': `主題 ${theme}` }
        }
    })
    furnitureDetailTemplate.body.contents[2].contents[0].contents[1].contents = themesSpan;

    let obtainedFrom = furniture.obtainedFrom == 'DIY' ? furniture.diyInfoObtainedFrom : [furniture.obtainedFrom];
    let obtainedFromSpan =  obtainedFrom.map((obtained) => {
        let text = '';
        if (obtained === '氣球') {
            text = furniture.diyInfoSourceNotes.replace('僅在', '').replace('期間獲得', '')
        } else {
            text = obtained
        }
        return {
            type: "text",
            text: `${furniture.obtainedFrom == 'DIY' ? 'DIY-' : ''}${obtained}`,
            color: style.color.base.blue,
            size: "md",
            align: "center",
            wrap: true,
            action: { 'type': 'message', 'label': 'Yes', 'text': `${furniture.obtainedFrom == 'DIY' ? 'DIY ' : '取得方式 '}${text}` }
        }
    })
    furnitureDetailTemplate.body.contents[2].contents[1].contents[1].contents = obtainedFromSpan;

    if (furniture.bodyCustomize) {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[0].text = `款式系列(可改造：${furniture.bodyTitle})`;
    } else {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[0].text = `款式系列`;
    }

    if (furniture.patternCustomize) {
        furnitureDetailTemplate.body.contents[8].contents[0].contents[0].text = `樣式系列(可改造：${furniture.patternTitle})`;
    } else {
        furnitureDetailTemplate.body.contents[8].contents[0].contents[0].text = `樣式系列`;
    }

    bodys = Object.keys(furniture.variations.bodys).join('、')
    furnitureDetailTemplate.body.contents[6].contents[0].contents[1].text = bodys ? bodys : '無';
    pattrens = Object.keys(furniture.variations.pattrens).join('、')

    furnitureDetailTemplate.body.contents[8].contents[0].contents[1].text = pattrens ? pattrens : '無';

    let carousel = {
        'type': 'carousel',
        'contents': [furnitureDetailTemplate]
    };

    if (bodys) {
        let furnitureVariationsBodyTemplate = variations(furniture.variations.bodys, furniture.filename, '款式', furniture.bodyCustomize, furniture.bodyTitle, furniture.name_c);
        carousel.contents.push(JSON.parse(JSON.stringify(furnitureVariationsBodyTemplate)));
    }
    if (pattrens) {
        let furnitureVariationsPattrensTemplate = variations(furniture.variations.pattrens, furniture.filename, '樣式', furniture.patternCustomize, furniture.patternTitle, furniture.name_c);
        carousel.contents.push(JSON.parse(JSON.stringify(furnitureVariationsPattrensTemplate)));
    }
    
    if (furniture.obtainedFrom === 'DIY') {
        furnitureDetailTemplate.body.contents[4].contents[0].contents[1].text =  furniture.diyInfoMaterials.map((item) => `${item.itemName}x${item.count}`).join('; ')
        if (furniture.diyInfoSourceNotes) {
            furnitureDetailTemplate.body.contents[4].contents[0].contents[1].text += `\n(${furniture.diyInfoSourceNotes})`
        }
    } else {
        furnitureDetailTemplate.body.contents[4].contents[0].contents[1].text = '--'
    }

    return carousel
}

async function detail(context) {
    const itemName = context.event.text.split(/[-\s]/).splice(1).join(' ');
    furniture = query.findOne(furnitures, itemName);

    await context.sendFlex(`${itemName} 詳細資料`, info(furniture));
}

module.exports.info = info;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;