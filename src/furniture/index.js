const furnitures = require('../data/furniture.json');
const query = require('../lib/query');
const style = require('../lib/style');

const getAllNames = () => {
    return query.getAllNames(furnitures)
}

const variations = (variation, filename, type) => {
    let furniturevariationsTemplate = require('../template/furniture_variations.json');
    furniturevariationsTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    furniturevariationsTemplate.styles.body.backgroundColor = style.color.base.white;

    furniturevariationsTemplate.header.contents[0].text = `${type}差異`;

    const separator = {
        type: "separator"
    }
    let variations = {
        type: "box",
        layout: "vertical",
        contents: []
    }
    let bodyBoxs = Object.entries(variation).map((items) => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: items[0],
                    align: "center",
                    wrap: true,
                    size: "lg"
                },
                {
                    type: "image",
                    url: `https://acnhcdn.com/latest/FtrIcon/${filename.replace('0_0', '')}${type !== '款式' ? '0_' : ''}${items[1]}${type !== '樣式' ? '_0' : ''}.png`,
                    size: "md"
                }
            ]
        }
    })

    let bodyBoxs_2 = [];
    while (bodyBoxs.length) {
        let boxs = {
            type: "box",
            layout: "horizontal",
            contents: []
        }
        boxs.contents = bodyBoxs.splice(0, 2);
        bodyBoxs_2.push(boxs);
        if (bodyBoxs.length > 0) {
            bodyBoxs_2.push(separator);
        }
    }

    variations.contents = bodyBoxs_2;
    furniturevariationsTemplate.body.contents = [variations];

    return furniturevariationsTemplate
}

async function detail(context) {
    let furnitureDetailTemplate = require('../template/furniture_detail.json');
    const itemName = context.event.text.split('-')[1];
    furniture = query.findOne(furnitures, itemName);
    furnitureDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    furnitureDetailTemplate.styles.body.backgroundColor = style.color.base.white;

    // console.log(furniture)
    furnitureDetailTemplate.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/FtrIcon/${furniture.filename}.png`;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[0].text = furniture.name_c;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[1].text = furniture.name_j;
    furnitureDetailTemplate.header.contents[0].contents[1].contents[2].text = furniture.name_e;

    furnitureDetailTemplate.body.contents[0].contents[0].contents[1].text = furniture.buy === null ? '非賣品' : furniture.buy.toString();
    furnitureDetailTemplate.body.contents[0].contents[1].contents[1].text = furniture.sell.toString();
    furnitureDetailTemplate.body.contents[0].contents[2].contents[1].text = furniture.size;

    furnitureDetailTemplate.body.contents[2].contents[0].contents[1].text = furniture.category;
    furnitureDetailTemplate.body.contents[2].contents[1].contents[1].text = furniture.tag;
    furnitureDetailTemplate.body.contents[2].contents[2].contents[1].text = furniture.themes;

    furnitureDetailTemplate.body.contents[4].contents[0].contents[1].text = furniture.interact ? '可' : '不能';
    furnitureDetailTemplate.body.contents[4].contents[1].contents[1].text = furniture.obtainedFrom;

    if (furniture.bodyCustomize) {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[0].text = `款式(${furniture.bodyTitle})`
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[0].color = style.color.base.black;
    } else {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[0].text = `款式`;
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[0].color = style.color.select.false;
    }

    if (furniture.patternCustomize) {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[2].text = `樣式(${furniture.patternTitle})`
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[2].color =style.color.base.black;
    } else {
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[2].text = `樣式`
        furnitureDetailTemplate.body.contents[6].contents[0].contents[1].contents[2].color = style.color.select.false;
    }

    furnitureDetailTemplate.body.contents[8].contents[0].contents[1].text = furniture.bodys ? furniture.bodys : '無';
    furnitureDetailTemplate.body.contents[10].contents[0].contents[1].text = furniture.pattrens ? furniture.pattrens : '無';

    let carousel = {
        'type': 'carousel',
        'contents': [furnitureDetailTemplate]
    };

    if (furniture.bodys) {
        let furnitureVariationsBodyTemplate = variations(furniture.variations.bodys, furniture.filename, '款式');
        carousel.contents.push(JSON.parse(JSON.stringify(furnitureVariationsBodyTemplate)));
    }
    if (furniture.pattrens) {
        let furnitureVariationsPattrensTemplate = variations(furniture.variations.pattrens, furniture.filename, '樣式');
        carousel.contents.push(JSON.parse(JSON.stringify(furnitureVariationsPattrensTemplate)));
    }

    await context.sendFlex('This is a furniture detail flex', carousel);
}

module.exports.detail = detail;
module.exports.getAllNames = getAllNames;