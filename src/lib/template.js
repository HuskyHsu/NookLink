let itemListTemplate = require('../template/item_list.json');

const separator = {
    type: "separator",
    margin: "md"
}

const typeNameMap = {
    '家具': '家具',
    '小物件': '家具',
    '壁掛物': '家具'
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
                    url: `https://acnhcdn.com/latest/FtrIcon/${item.filename}.png`,
                    size: "md",
                    action: {
                        'type': 'message',
                        'label': 'Yes',
                        'text': `${typeNameMap[item.category]}-${item.name_c}`
                    }
                },
                {
                    type: "text",
                    text: item.name_c,
                    align: "center",
                    wrap: true,
                    size: "xs",
                    action: {
                        'type': 'message',
                        'label': 'Yes',
                        'text': `${typeNameMap[item.category]}-${item.name_c}`
                    },
                    contents: [
                        {
                            type: "span",
                            text: `${item.name_c}\n`
                        },
                        {
                            type: "span",
                            text: `${item.name_j}\n`,
                            size: "xxs"
                        },
                        {
                            type: "span",
                            text: item.name_e,
                            size: "xxs"
                        }
                    ]
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
            text: `→ ${item.name_c}`,
            gravity: "center",
            margin: 'xl',
            size: "lg",
            action: {
                type: 'message',
                label: 'Yes',
                text: `${typeNameMap[item.category]}-${item.name_c}`
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

module.exports.list = list;
module.exports.simpleList = simpleList;