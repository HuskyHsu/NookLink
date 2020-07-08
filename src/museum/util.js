const style = require('../lib/style');

function currentList(month, type, list) {
    const nextMonth = month < 12 ? month + 1 : 1;
    const preMonth = month > 1 ? month - 1 : 12;
    const typeName = type === 'fish' ? '魚' : '蟲';

    let carousel = {
        'type': 'carousel',
        'contents': []
    }

    for (let i = 0; i < 4; i++) {
        let listTemplate = require('../template/museum_list.json');
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
                        'text': `${typeName} ${item.name_c}`
                    };

                const Nhaunt = ((item.N_month[month - 1] && !item.N_month[nextMonth - 1]) ? '！' : '') + ((item.N_month[month - 1] && !item.N_month[preMonth - 1]) ? '★' : '');
                const Shaunt = ((item.S_month[month - 1] && !item.S_month[nextMonth - 1]) ? '！' : '') + ((item.S_month[month - 1] && !item.S_month[preMonth - 1]) ? '★' : '');

                listTemplate.body.contents[j].contents.push({
                    'type': 'text',
                    'text': `${item.name_c}`,
                    'align': 'center',
                    'contents': [{
                            'type': 'span',
                            'text': `北${Nhaunt}`,
                            'size': 'sm',
                            'color': style.color.select[item.N_month[month - 1]],
                            'weight': 'bold'
                        }, {
                            'type': 'span',
                            'text': ' '
                        },
                        {
                            'type': 'span',
                            'text': `南${Shaunt}`,
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

        listTemplate.footer.contents[0].text = `標註！者為下月(${nextMonth}月)無法取得`;
        listTemplate.footer.contents[1].text = `標註★者為本月(${month}月)新出沒`;
        listTemplate.footer.contents[2].contents[1].action.label = `下月(${nextMonth}月)清單`;
        listTemplate.footer.contents[2].contents[1].action.text = `${typeName} ${nextMonth}月`;
        listTemplate.footer.contents[2].contents[0].action.text = typeName;
        carousel.contents.push(JSON.parse(JSON.stringify(listTemplate)))
    }

    return carousel
}

function currentListNew(month, type, list) {
    const nextMonth = month < 12 ? month + 1 : 1;
    const preMonth = month > 1 ? month - 1 : 12;
    const typeName = '海底生物';
    const totalCount = type === 'seaCreatures' ? 40 : 80; 

    let carousel = {
        'type': 'carousel',
        'contents': []
    }

    for (let i = 0; i < totalCount/20; i++) {
        let listTemplate = require('../template/museum_list.json');
        listTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
        listTemplate.styles.body.backgroundColor = style.color.backgroundColor.body;
        listTemplate.body.contents = [];
        listTemplate.header.contents[0].text = `${month}月出沒${typeName}一覽表(${i+1}/${totalCount/20})`
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
                        'text': `${typeName} ${item.name_c}`
                    };

                const Nhaunt = ((item.N_month[month - 1] != null && item.N_month[nextMonth - 1] == null) ? '！' : '') + ((item.N_month[month - 1] != null && item.N_month[preMonth - 1] == null) ? '★' : '');
                const Shaunt = ((item.S_month[month - 1] != null && item.S_month[nextMonth - 1] == null) ? '！' : '') + ((item.S_month[month - 1] != null && item.S_month[preMonth - 1] == null) ? '★' : '');

                listTemplate.body.contents[j].contents.push({
                    'type': 'text',
                    'text': `${item.name_c}`,
                    'align': 'center',
                    'color': style.color.select[false],
                    'size': 'xs',
                    'margin': 'xs',
                    'action': action
                })

                listTemplate.body.contents[j].contents.push({
                    'type': 'image',
                    'url': `https://acnhcdn.com/latest/MenuIcon/${item.filename}.png`,
                    'size': 'md',
                    'action': action
                })

                listTemplate.body.contents[j].contents.push({
                    'type': 'text',
                    'text': `${item.name_c}`,
                    'align': 'center',
                    'action': action,
                    'contents': [{
                            'type': 'span',
                            'text': `北${Nhaunt}`,
                            'size': 'xs',
                            'color': style.color.select[item.N_month[month - 1] != null],
                            'weight': 'bold'
                        }, {
                            'type': 'span',
                            'text': ' ',
                            'size': 'xs'
                        },
                        {
                            'type': 'span',
                            'text': `南${Shaunt}`,
                            'size': 'xs',
                            'color': style.color.select[item.S_month[month - 1] != null],
                            'weight': 'bold'
                        }
                    ]
                })

                if (k < 5) {
                    listTemplate.body.contents[j].contents.push({
                        'type': 'separator',
                        'margin': 'xs'
                    })
                }
            }
        }

        listTemplate.footer.contents[0].text = `標註！者為下月(${nextMonth}月)無法取得`;
        listTemplate.footer.contents[1].text = `標註★者為本月(${month}月)新出沒`;
        listTemplate.footer.contents[2].contents[1].action.label = `下月(${nextMonth}月)清單`;
        listTemplate.footer.contents[2].contents[1].action.text = `${typeName} ${nextMonth}月`;
        listTemplate.footer.contents[2].contents[0].action.text = typeName;
        carousel.contents.push(JSON.parse(JSON.stringify(listTemplate)))
    }

    return carousel
}

module.exports.currentList = currentList;
module.exports.currentListNew = currentListNew;