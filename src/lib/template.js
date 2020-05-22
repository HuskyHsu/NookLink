let itemListTemplate = require('../template/item_list.json');
let style = require('../lib/style');

const separator = {
    type: "separator",
    margin: "md"
}

const typeNameMap = {
    '家具': '查詢',
    '小物件': '查詢',
    '壁掛物': '查詢',
    '工具': '圖',
    '柵欄': '圖',
    '其他': '圖',
    '頭飾': '圖',
    '配飾': '圖',
    '壁紙': '圖',
    '地板': '圖',
    '雨傘': '圖',
    '地毯': '圖',
    '洋裝': '圖',
    '褲/裙': '圖',
    '上衣': '圖',
    '包包': '圖',
    '鞋類': '圖'
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
                        'text': `${typeNameMap[item.category] === '圖' ? '圖-' + item.filename : typeNameMap[item.category] + '-' + item.name_c}`
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
                        'type': 'message',
                        'label': 'Yes',
                        'text': `${typeNameMap[item.category] === '圖' ? '圖-' + item.filename : typeNameMap[item.category] + '-' + item.name_c}`
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
            text: `→ ${item.name_c}${item.DIY ? '(DIY)' : ''}`,
            gravity: "center",
            margin: 'xl',
            size: "lg",
            color: `${item.DIY ? style.color.base.red : style.color.base.black}`,
            action: {
                type: 'message',
                label: 'Yes',
                'text': `${typeNameMap[item.category] === '圖' ? '圖-' + item.filename : typeNameMap[item.category] + '-' + item.name_c}`
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