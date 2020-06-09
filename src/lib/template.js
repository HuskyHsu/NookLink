let itemListTemplate = require('../template/item_list.json');
let style = require('../lib/style');
let { info } = require('../items/furniture');

const separator = {
    type: "separator",
    margin: "md"
}

const typeNameMap = {
    '家具': '查詢',
    '小物件': '查詢',
    '壁掛物': '查詢',
    '藝術': '查詢',
    '工具': 'DIY',
    '柵欄': 'DIY',
    '其他': 'DIY',
    '頭戴物': 'DIY',
    '飾品': 'DIY',
    '壁紙': 'DIY',
    '地板': 'DIY',
    '雨傘': 'DIY',
    '地毯': 'DIY',
    '洋裝': 'DIY',
    '下身': 'DIY',
    '上身': 'DIY',
    '包包': 'DIY',
    '鞋子': 'DIY',
    '套裝': 'DIY'
}

const infoDiy = (item) => {
    let itemDetailTemplate = require('../template/item_detail.json');
    itemDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    itemDetailTemplate.styles.body.backgroundColor = style.color.base.white;

    itemDetailTemplate.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/FtrIcon/${item.filename}.png`;
    itemDetailTemplate.header.contents[0].contents[0].action.data = `type=fig&name=${item.name_c}&fileName=${item.filename}`;
    
    itemDetailTemplate.header.contents[0].contents[1].contents[0].text = item.name_c;
    itemDetailTemplate.header.contents[0].contents[1].contents[1].text = item.name_j;
    itemDetailTemplate.header.contents[0].contents[1].contents[2].text = item.name_e;

    itemDetailTemplate.body.contents[0].contents[0].contents[1].text = item.sell.toString();

    let obtainedFromSpan =  item.obtainedFrom.map((obtained) => {
        let text = '';
        if (obtained === '氣球') {
            text = item.sourceNotes.replace('僅在', '').replace('期間獲得', '')
        } else {
            text = obtained
        }
        return {
            type: "text",
            text: `DIY-${obtained}`,
            color: style.color.base.blue,
            size: "md",
            align: "center",
            wrap: true,
            action: { 'type': 'message', 'label': 'Yes', 'text': `DIY ${text}` }
        }
    })
    itemDetailTemplate.body.contents[0].contents[1].contents[1].contents = obtainedFromSpan;

    itemDetailTemplate.body.contents[2].contents[0].contents[1].text = item.materials.map((i) => `${i.itemName}x${i.count}`).join('; ')
    if (item.sourceNotes) {
        itemDetailTemplate.body.contents[2].contents[0].contents[1].text += `\n(${item.sourceNotes})`
    }

    return itemDetailTemplate
}

const infoArt = (item) => {
    let itemDetailTemplate = require('../template/art_detail.json');
    itemDetailTemplate.header.contents[0].contents[0].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/art/${item.filename}.jpg`;
    itemDetailTemplate.header.contents[0].contents[0].action.data = `type=fig&name=${item.realArtworkTitle_tw}&fileName=https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/art/${item.filename}.jpg`;
    itemDetailTemplate.header.contents[0].contents[1].contents[0].text = item.name_c;
    itemDetailTemplate.header.contents[0].contents[1].contents[1].text = item.realArtworkTitle;
    itemDetailTemplate.header.contents[0].contents[1].contents[2].text = item.realArtworkTitle_tw;

    itemDetailTemplate.body.contents[0].contents[0].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.filename}.png`;
    itemDetailTemplate.body.contents[0].contents[0].contents[1].action.data = `type=fig&name=${item.name_c}(真品)&fileName=${item.filename}`;
    if (item.haveFake) {
        itemDetailTemplate.body.contents[0].contents[1].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.filename}Fake.png`;
        itemDetailTemplate.body.contents[0].contents[1].contents[1].action.data = `type=fig&name=${item.name_c}(贗品)&fileName=${item.filename}Fake`;
    } else {
        itemDetailTemplate.body.contents[0].contents[1].contents[1].url = 'https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/art/noFake.jpg'
        itemDetailTemplate.body.contents[0].contents[1].contents[1].action.data = '-';
    }

    itemDetailTemplate.body.contents[2].contents[0].contents[1].text = item.artist;
    itemDetailTemplate.body.contents[4].contents[0].contents[1].text = item.museumDescription;
    
    return itemDetailTemplate
}

const infoVillager = (item) => {
    let itemDetailTemplate = require('../template/villager_detail.json');
    itemDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    itemDetailTemplate.styles.body.backgroundColor = style.color.base.white;

    itemDetailTemplate.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/NpcIcon/${item.filename}.png`;
    itemDetailTemplate.header.contents[0].contents[0].action.data = `type=fig&name=${item.name_c}&fileName=https://acnhcdn.com/latest/NpcIcon/${item.filename}.png`;
    
    itemDetailTemplate.header.contents[0].contents[1].contents[0].text = `${item.name_c} (${item.birthday.replace('/', '月')}日)`;
    itemDetailTemplate.header.contents[0].contents[1].contents[1].text = `${item.name_j} / ${item.name_e}`;
    itemDetailTemplate.header.contents[0].contents[1].contents[2].text = `種族 - ${item.species} (${item.gender})`;
    itemDetailTemplate.header.contents[0].contents[1].contents[3].text = `個性 - ${item.personality}`;

    let personalityAction = { 'type': 'message', 'text': `個性 ${item.personality}` }
    itemDetailTemplate.header.contents[0].contents[1].contents[3].action = personalityAction
    itemDetailTemplate.header.contents[0].contents[1].contents[3].color = style.color.base.blue;

    let speciesAction = { 'type': 'message', 'text': `種族 ${item.species}` }
    itemDetailTemplate.header.contents[0].contents[1].contents[2].action = speciesAction
    itemDetailTemplate.header.contents[0].contents[1].contents[2].color = style.color.base.blue;

    itemDetailTemplate.body.contents[0].contents[0].contents[1].text = item.hobby;

    itemDetailTemplate.body.contents[0].contents[1].contents[1].text = item.catchphrase;
    itemDetailTemplate.body.contents[0].contents[2].contents[1].text = item.favoriteSong;

    itemDetailTemplate.body.contents[2].contents[0].contents[0].text = `壁紙-${item.wallpaper.name}`;
    itemDetailTemplate.body.contents[2].contents[0].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.wallpaper.filename}.png`;

    itemDetailTemplate.body.contents[2].contents[1].contents[0].text = `地板-${item.flooring.name}`;
    itemDetailTemplate.body.contents[2].contents[1].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.flooring.filename}.png`;

    itemDetailTemplate.body.contents[4].contents[0].contents[1].text = item.furnitureList.map((furniture) => furniture.name).join('、');

    return itemDetailTemplate
}

const list = (itemList, width, height) => {
    let carousel = {
        type: 'carousel',
        contents: []
    };

    let itemBoxs = itemList.map((item) => {
        return {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: `https://acnhcdn.com/latest/${item.type !== 'villagers' ? 'FtrIcon' : 'NpcIcon'}/${item.filename}.png`,
                    size: "md",
                    action: {
                        type: 'message',
                        text: `查詢 ${item.name_c}`
                    }
                },
                {
                    type: "text",
                    text: item.name_c,
                    align: "center",
                    wrap: true,
                    size: "xs",
                    color: `${item.DIY ? style.color.base.red : style.color.base.black}`,
                    action: {
                        type: 'message',
                        text: `查詢 ${item.name_c}`
                    }
                },
                
            ]
        }
    })

    let itemBoxs_h_v = [];
    while (itemBoxs.length) {
        let itemBoxs_h = {
            type: "box",
            layout: "horizontal"
        }
        itemBoxs_h.contents = itemBoxs.splice(0, width);

        if (itemBoxs_h.contents.length < width) {
            const needCount = width - itemBoxs_h.contents.length;
            for (let i = 0; i < needCount; i++) {
                itemBoxs_h.contents.push(
                    {
                        type: "text",
                        text: ' ',
                    }
                )
            }
        }

        itemBoxs_h_v.push(itemBoxs_h);
        if (itemBoxs.length > 0) {
            itemBoxs_h_v.push(separator);
            if (itemBoxs_h_v.length >= (height * 2 - 1)) {
                let page = {
                    type: "box",
                    layout: "vertical",
                    contents: itemBoxs_h_v
                }
                itemListTemplate.body.contents = [page];
                carousel.contents.push(JSON.parse(JSON.stringify(itemListTemplate)))
                itemBoxs_h_v = []
            }
        }
    }
    let page = {
        type: "box",
        layout: "vertical",
        contents: itemBoxs_h_v
    }
    itemListTemplate.body.contents = [page];
    carousel.contents.push(JSON.parse(JSON.stringify(itemListTemplate)))
    console.log('carousel')
    console.log(carousel)
    // page.contents = bodyBoxs_2;
    return carousel
}

const simpleList = (itemList) => {
    let itemBoxs = [];
    itemList.forEach((item) => {
        itemBoxs.push({
            type: "text",
            text: `→ ${item.name_c}${item.DIY ? '(DIY)' : ''}${item.type === 'villagers' ? '(' + item.species + ')' : ''}`,
            gravity: "center",
            margin: 'xl',
            color: `${item.DIY ? style.color.base.red : style.color.base.black}`,
            action: {
                type: 'message',
                text: `查詢 ${item.name_c}`
            }
        })
    });
    itemListTemplate.body.contents = [
        {
            type: "box",
            layout: "vertical",
            contents: itemBoxs
        }
    ];
    return itemListTemplate
}

module.exports.info = {
    'furnitures': info,
    'recipes': infoDiy,
    'arts': infoArt,
    'villagers': infoVillager
};

// module.exports.infoDiy = infoDiy;
// module.exports.infoArt = infoArt;
// module.exports.infoVillager = infoVillager;
module.exports.list = list;
module.exports.simpleList = simpleList;