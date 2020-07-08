let _ = require('lodash');

let itemListTemplate = require('../template/item_list.json');
let style = require('../lib/style');
let { info } = require('../items/furniture');

const separator = {
    type: "separator",
    margin: "md"
}

const infoDiy = (item) => {
    let itemDetailTemplate = require('../template/item_recipe.json');
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
    let itemDetailTemplate = require('../template/item_art.json');
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
    
    itemDetailTemplate.header.contents[0].contents[1].contents[0].text = `${item.name_c}(${item.gender})`;
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

const infoClothing = (item) => {
    let itemDetailTemplate = JSON.stringify(require('../template/item_clothing.json'));
    let compiled = _.template(itemDetailTemplate);
    let carousel = compiled({
        backgroundColorHeader: style.color.backgroundColor.header,
        backgroundColorBody: style.color.base.white,
        filenameUrl: `https://acnhcdn.com/latest/ClosetIcon/${item.filename}.png`,
        imagePostback: `type=fig&name=${item.name_c}&fileName=https://acnhcdn.com/latest/ClosetIcon/${item.filename}.png`,
        name_c: item.name_c,
        name_j: item.name_j || '-',
        name_e: item.name_e || '-',
        category: item.category,
        buy: item.buy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '非賣品',
        sell: item.sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        obtainedFrom: item.obtainedFrom,
        seasonalAvailability: item.seasonalAvailability,
        styles: item.styles,
        themes: item.themes.join('、'),
        villagerEquippable: item.villagerEquippable ? '會穿' : '不穿',
        blue: style.color.base.blue
    });

    carousel = JSON.parse(carousel);

    if (item.variations > 0) {
        const width = 3;
        let itemBoxs = Array.from(Array(item.variations).keys()).map((i, index) => {
            return {
                type: "image",
                url: `https://acnhcdn.com/latest/ClosetIcon/${item.filename.slice(0, -1)}${ index }.png`,
                size: "md"
            }
        });

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
        }
        let matchTemplate = JSON.parse(JSON.stringify(itemListTemplate));
        matchTemplate.body.contents = itemBoxs_h_v;
        matchTemplate.header.contents[0].text = '全部樣式';
        carousel.contents.push(matchTemplate);
    }
    
    return carousel
}

const infoHomeStyle = (item) => {
    let itemDetailTemplate = JSON.stringify(require('../template/item_homeStyle.json'));
    let compiled = _.template(itemDetailTemplate);
    let bubble = compiled({
        backgroundColorHeader: style.color.backgroundColor.header,
        backgroundColorBody: style.color.base.white,
        filenameUrl: `https://acnhcdn.com/latest/FtrIcon/${item.filename}.png`,
        imagePostback: `type=fig&name=${item.name_c}&fileName=${item.filename}`,
        name_c: item.name_c,
        name_j: item.name_j || '-',
        name_e: item.name_e || '-',
        category: item.category,
        buy: item.buy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '非賣品',
        sell: item.sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        obtainedFrom: item.obtainedFrom,
        tag: item.tag,
        blue: style.color.base.blue
    });

    bubble = JSON.parse(bubble);
    bubble.body.contents[4].contents[0].contents[1].contents = item.themes.map((theme) => {
        return {
            type: "text",
            text: theme,
            color: style.color.base.blue,
            size: "md",
            align: "center",
            wrap: true,
            action: { 'type': 'message', 'text': `主題 ${theme}` }
        }
    })

    return bubble
}

const infoEquippables = (item) => {
    let itemDetailTemplate = JSON.stringify(require('../template/item_equippables.json'));
    let compiled = _.template(itemDetailTemplate);
    let bubble = compiled({
        backgroundColorHeader: style.color.backgroundColor.header,
        backgroundColorBody: style.color.base.white,
        filenameUrl: `https://acnhcdn.com/latest/FtrIcon/${item.filename}.png`,
        imagePostback: `type=fig&name=${item.name_c}&fileName=${item.filename}`,
        name_c: item.name_c,
        name_j: item.name_j || '-',
        name_e: item.name_e || '-',
        category: item.category,
        buy: item.buy.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '非賣品',
        sell: item.sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
        obtainedFrom: item.obtainedFrom,
        blue: style.color.base.blue
    });

    bubble = JSON.parse(bubble);
    return bubble
}

const commands = () => {
    let commandTemplate = JSON.parse(JSON.stringify(require('../template/command.json')));
	[
		{
			header: '查詢 [物品名稱]',
			body: '查詢物品、服飾、壁紙、地板、地毯、居民、藝術品資訊',
			action: '查詢 鑄鐵木',
			contents: 0
		}, {
			header: 'tag [tag名稱]',
			body: '查詢含該tag之家具清單',
			action: 'tag 海濱',
			contents: 0
		}, {
			header: '主題 [主題名稱]',
			body: '查詢含該主題之家具清單',
			action: '主題 海洋',
			contents: 0
		}, {
			header: '取得方式 [取得方式]',
			body: '查詢該取得方式之清單',
			action: '取得方式 呂遊',
			contents: 0
		}, {
			header: '主題 [主題名稱]',
			body: '查詢含該主題之家具清單',
			action: '主題 海洋',
			contents: 0
		}, {
			header: 'DIY [DIY關鍵字]',
			body: '查詢DIY物品、來源、活動',
			action: 'DIY 成熟型村民',
			contents: 0
		}, {
			header: '材料 [材料關鍵字]',
			body: '查詢該材料可製作DIY清單',
			action: '材料 大星星碎片',
			contents: 0
		}, {
			header: '種族 [種族類別]',
			body: '查詢該種族之居民清單',
			action: '種族 貓',
			contents: 1
		}, {
			header: '個性 [個性類別]',
			body: '查詢該個性之居民清單',
			action: '個性 大姐姐',
			contents: 1
		}, {
			header: '表情 [個性類別]',
			body: '查詢該個性可學表情之清單',
			action: '表情 大姐姐',
			contents: 1
		}, {
			header: '魚',
			body: '當月彙整魚圖鑑',
			action: '魚',
			contents: 2
		}, {
			header: '魚 [數字]月',
			body: '指定月份彙整魚圖鑑',
			action: '魚 1月',
			contents: 2
		}, {
			header: '魚 [名稱(中、英、日、編號)]',
			body: '該魚詳細資料',
			action: '魚 雙髻鯊',
			contents: 2
		}, {
			header: '蟲',
			body: '當月彙整蟲圖鑑',
			action: '蟲',
			contents: 2
		}, {
			header: '蟲 [數字]月',
			body: '指定月份彙整蟲圖鑑',
			action: '蟲 1月',
			contents: 2
		}, {
			header: '蟲 [名稱(中、英、日、編號)]',
			body: '該蟲詳細資料',
			action: '蟲 螢火蟲',
			contents: 2
		}, {
			header: '海底生物',
			body: '當月彙整海底生物圖鑑',
			action: '海底生物',
			contents: 2
		}, {
			header: '海底生物 [數字]月',
			body: '指定月份彙整海底生物圖鑑',
			action: '海底生物 1月',
			contents: 2
		}, {
			header: '海底生物 [名稱(中、英、日、編號)]',
			body: '該海底生物詳細資料',
			action: '海底生物 高腳蟹',
			contents: 2
		}
	].forEach((command) => {
		let body = {
			"type": "box",
			"layout": "vertical",
			"contents": [
				{
					"type": "text",
					"text": command.header,
					"size": "md",
					"weight": "bold",
					"color": style.color.base.blue,
					"action": {
						"type": "message",
						"text": command.action
					}
				}, {
					"type": "text",
					"text": command.body,
					"size": "sm",
					"wrap": true,
					"action": {
						"type": "message",
						"text": command.action
					}
				}
			]
		}
		commandTemplate.contents[command.contents].body.contents.push(body);
	})

	return commandTemplate;
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
        } else if (item.type === 'clothes') {
            imgPath = 'ClosetIcon'
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
    carousel.contents.push(JSON.parse(JSON.stringify(itemListTemplate)));
    return carousel
}

const simpleList = (itemList) => {
    let itemBoxs = [];
    itemList.forEach((item) => {
        box = {
            type: "text",
            text: `→ ${item.name_c}${item.DIY ? '(DIY)' : ''}${item.type === 'villagers' ? '(' + item.species + ')' : ''}`,
            margin: 'xl',
            action: {
                type: 'message',
                text: `查詢 ${item.name_c}`
            }
        }

        if (item.DIY) {
            box.color = style.color.base.red
        }
        itemBoxs.push(box)
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
    'villagers': infoVillager,
    'clothes': infoClothing,
    'homeStyle': infoHomeStyle,
    'equippables': infoEquippables
};
module.exports.commands = commands;
module.exports.list = list;
module.exports.simpleList = simpleList;