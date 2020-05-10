const style = require('../lib/style');

function currentList(month, type, list) {
    const nextMonth = month < 12 ? month + 1 : 1;
    const typeName = type === 'fish' ? '魚' : '蟲';

    let carousel = {
        'type': 'carousel',
        'contents': []
    }

    for (let i = 0; i < 4; i++) {
        let listTemplate = require('../template/list.json');
        listTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
        listTemplate.styles.body.backgroundColor = style.color.backgroundColor.body;
        listTemplate.body.contents = [];
        listTemplate.header.contents[0].text = `${month}月出沒${typeName}一覽表(${i+1}/4)`
        for (let j = 0; j < 4; j++) {
            listTemplate.body.contents.push({
                'type': 'box',
                'layout': 'vertical',
                'contents': []
            })
            for (let k = 1; k < 6; k++) {
                const itemIndex = i * 20 + j * 5 + k;
                const item = list[itemIndex - 1];
                const action = {
                        'type': 'message',
                        'label': 'Yes',
                        'text': `${typeName}-${item.name_c}`
                    };
                listTemplate.body.contents[j].contents.push({
                    'type': 'text',
                    'text': `${item.name_c}`,
                    'align': 'center',
                    'contents': [{
                            'type': 'span',
                            'text': '北' + ((item.N_month[month - 1] && !item.N_month[nextMonth - 1]) ? '❗︎' : ''),
                            'size': 'sm',
                            'color': style.color.select[item.N_month[month - 1]],
                            'weight': 'bold'
                        }, {
                            'type': 'span',
                            'text': ' '
                        },
                        {
                            'type': 'span',
                            'text': '南' + ((item.S_month[month - 1] && !item.S_month[nextMonth - 1]) ? '❗︎' : ''),
                            'size': 'sm',
                            'color': style.color.select[item.S_month[month - 1]],
                            'weight': 'bold'
                        }
                    ],
                    'action': action
                })
                listTemplate.body.contents[j].contents.push({
                    'type': 'image',
                    'url': `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/${type}/${itemIndex}.png`,
                    'size': 'md',
                    'action': action
                })
                if (k < 5) {
                    listTemplate.body.contents[j].contents.push({
                        'type': 'separator'
                    })
                }
            }
        }

        listTemplate.footer.contents[0].text = `標註 \"❗︎\" 者為下月(${nextMonth}月)無法取得`;
        listTemplate.footer.contents[1].contents[1].action.label = `下月(${nextMonth}月)清單`;
        listTemplate.footer.contents[1].contents[1].action.text = `${typeName}-${nextMonth}月`;
        carousel.contents.push(JSON.parse(JSON.stringify(listTemplate)))
    }

    return carousel
}

module.exports.currentList = currentList;