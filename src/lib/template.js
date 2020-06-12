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

    itemDetailTemplate.body.contents[0].contents[0].contents[1].text = item.sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

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
    let carouselTemplate = require('../template/villager_detail.json');
    let itemDetailTemplate = carouselTemplate.contents[0];

    itemDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    itemDetailTemplate.styles.body.backgroundColor = style.color.base.white;

    itemDetailTemplate.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/NpcIcon/${item.filename}.png`;
    itemDetailTemplate.header.contents[0].contents[0].action.data = `type=fig&name=${item.name_c}&fileName=https://acnhcdn.com/latest/NpcIcon/${item.filename}.png`;
    
    itemDetailTemplate.header.contents[0].contents[1].contents[0].text = `${item.name_c}`;
    itemDetailTemplate.header.contents[0].contents[1].contents[1].text = `${item.name_j}`;
    itemDetailTemplate.header.contents[0].contents[1].contents[2].text = `${item.name_e}`;

    itemDetailTemplate.body.contents[0].contents[0].contents[1].text = item.hobby;
    itemDetailTemplate.body.contents[0].contents[1].contents[1].text = item.catchphrase;
    itemDetailTemplate.body.contents[0].contents[2].contents[1].text = item.favoriteSong;

    itemDetailTemplate.body.contents[2].contents[0].contents[1].text = `${item.birthday.replace('/', '月')}日`;
    itemDetailTemplate.body.contents[2].contents[1].contents[1].text = item.species;
    itemDetailTemplate.body.contents[2].contents[2].contents[1].text = item.personality;

    let speciesAction = { 'type': 'message', 'text': `種族 ${item.species}` }
    itemDetailTemplate.body.contents[2].contents[1].contents[1].action = speciesAction
    itemDetailTemplate.body.contents[2].contents[1].contents[1].color = style.color.base.blue;

    let personalityAction = { 'type': 'message', 'text': `個性 ${item.personality}` }
    itemDetailTemplate.body.contents[2].contents[2].contents[1].action = personalityAction
    itemDetailTemplate.body.contents[2].contents[2].contents[1].color = style.color.base.blue;

    itemDetailTemplate.body.contents[6].contents[0].contents[1].text = `點我看清單`;
    itemDetailTemplate.body.contents[6].contents[1].contents[1].text = `點我看清單`;

    let personalityDiyAction = { 'type': 'message', 'text': `DIY ${item.personality}` }
    itemDetailTemplate.body.contents[6].contents[0].contents[1].action = personalityDiyAction;
    itemDetailTemplate.body.contents[6].contents[0].contents[1].color = style.color.base.blue;
    
    let personalityReactionAction = { 'type': 'message', 'text': `表情 ${item.personality}` }
    itemDetailTemplate.body.contents[6].contents[1].contents[1].action = personalityReactionAction;
    itemDetailTemplate.body.contents[6].contents[1].contents[1].color = style.color.base.blue;

    itemDetailTemplate.body.contents[4].contents[1].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/BromideNpcNml${item.filename.slice(0,1).toUpperCase()}${item.filename.slice(1)}_Remake_0_0.png`;
    itemDetailTemplate.body.contents[4].contents[2].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/PosterNpcNml${item.filename.slice(0,1).toUpperCase()}${item.filename.slice(1)}.png`;
    itemDetailTemplate.body.contents[4].contents[0].contents[1].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/villager/${encodeURI(item.name_e)}.png`;

    carouselTemplate.contents[1].styles.body.backgroundColor = style.color.backgroundColor.header;

    let decorateTemplate = carouselTemplate.contents[2];
    decorateTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    decorateTemplate.styles.body.backgroundColor = style.color.base.white;

    decorateTemplate.hero.url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/villager/${encodeURI(item.name_e)}_interior.png`;
    decorateTemplate.hero.action.data = `type=fig&name=${item.name_c}的室內佈置&fileName=https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/villager/${encodeURI(item.name_e)}_interior.png`;
    
    decorateTemplate.body.contents[0].contents[0].contents[2].text = `${item.wallpaper.name}`;
    decorateTemplate.body.contents[0].contents[0].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.wallpaper.filename}.png`;

    decorateTemplate.body.contents[0].contents[1].contents[2].text = `${item.flooring.name}`;
    decorateTemplate.body.contents[0].contents[1].contents[1].url = `https://acnhcdn.com/latest/FtrIcon/${item.flooring.filename}.png`;

    const cols = [{
        "type": "box",
        "layout": "vertical",
        "contents": []
    }, {
        "type": "box",
        "layout": "vertical",
        "contents": []
    }]

     item.furnitureList.forEach((furniture, index) => {
        cols[index % cols.length].contents.push(
            {
                type: "text",
                text: furniture.name,
                color: style.color.base.blue,
                size: "sm",
                align: "center",
                wrap: true,
                action: { 'type': 'message', 'text': `查詢 ${furniture.name}` }
            }
        )
    })

    decorateTemplate.body.contents[2].contents[0].contents[1].contents = cols;

    return carouselTemplate
}

const list = (itemList, width, height) => {
    let carousel = {
        type: 'carousel',
        contents: []
    };

    let itemBoxs = itemList.map((item) => {
        let imgPath = 'FtrIcon';
        if (item.type === 'villagers') {
            imgPath = 'NpcIcon'
        } else if (item.type === 'reactions') {
            imgPath = 'ManpuIcon'
        }

        let unit = {
            type: "box",
            layout: "vertical",
            contents: [
                {
                    type: "image",
                    url: `https://acnhcdn.com/latest/${imgPath}/${item.filename}.png`,
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
                }
            ]
        }

        if (item.type === 'reactions') {
            delete unit.contents[0].action;
            delete unit.contents[1].action;
        }

        return unit
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