fishs = require('../data/fish.json');
fishDetailTemplate = require('../template/fish_detail.json');

getAllNames = () => {
    return fishs.map((fish) => `${fish.index}|${fish.name_c}|${fish.name_j}|${fish.name_e}|${fish.name_e.toLowerCase()}`).join('|')
}

createInfo = (fish) => {
    fishDetailTemplate.body.contents[0].contents[0].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/fish/${fish.index}.png`;
    fishDetailTemplate.body.contents[0].contents[1].contents[0].text = fish.name_c;
    fishDetailTemplate.body.contents[0].contents[1].contents[1].text = fish.name_j;
    fishDetailTemplate.body.contents[0].contents[1].contents[2].text = fish.name_e;

    fishDetailTemplate.body.contents[1].contents[0].contents[1].text = fish.price.toString();
    fishDetailTemplate.body.contents[1].contents[1].contents[1].text = fish.place;
    fishDetailTemplate.body.contents[1].contents[2].contents[1].text = fish.time + (fish.remark ? `(${fish.remark})` : '');
    fishDetailTemplate.body.contents[1].contents[3].contents[1].text = fish.shadow_size;

    for (let i = 0; i < 6; i++) {
        fishDetailTemplate.body.contents[5].contents[i].color = fish.N_month.indexOf(i + 1) > -1 ? '#ff0000' : '#cccccc';
        fishDetailTemplate.body.contents[9].contents[i].color = fish.S_month.indexOf(i + 1) > -1 ? '#ff0000' : '#cccccc';

        fishDetailTemplate.body.contents[6].contents[i].color = fish.N_month.indexOf(i + 7) > -1 ? '#ff0000' : '#cccccc';
        fishDetailTemplate.body.contents[10].contents[i].color = fish.S_month.indexOf(i + 7) > -1 ? '#ff0000' : '#cccccc';
    }
    return fishDetailTemplate
}

async function currentFish(context) {
    const month = new Date().getMonth() + 1;
    const nextMonth = month < 12 ? month + 1 : 1;
    // f = fishs.filter((fish) => {
    //     return fish.S_month.indexOf(month) > -1
    // }).map((fish) => fish.name_c).join('、');

    let carousel = {
        "type": "carousel",
        "contents": []
    }

    for (let i = 0; i < 4; i++) {
        let fishListTemplate = require('../template/fish_list.json');
        fishListTemplate.body.contents = []
        fishListTemplate.header.contents[0].text = `${month}月出沒魚訊(${i+1}/4)`
        for (let j = 0; j < 4; j++) {
            fishListTemplate.body.contents.push({
                "type": "box",
                "layout": "vertical",
                "contents": []
            })
            for (let k = 1; k < 6; k++) {
                const fishIndex = i * 20 + j * 5 + k;
                const fish = fishs[fishIndex - 1];
                fishListTemplate.body.contents[j].contents.push({
                    "type": "text",
                    "text": `${fish.name_c}`,
                    "align": "center",
                    "contents": [{
                            "type": "span",
                            "text": `北` + ((fish.N_month.indexOf(month) > -1 && fish.N_month.indexOf(nextMonth) < 0) ? '❗︎' : ''),
                            "size": "sm",
                            "color": fish.N_month.indexOf(month) > -1 ? '#ff0000' : '#cccccc',
                            "weight": "bold"
                        }, {
                            "type": "span",
                            "text": " "
                        },
                        {
                            "type": "span",
                            "text": `南` + ((fish.S_month.indexOf(month) > -1 && fish.S_month.indexOf(nextMonth) < 0) ? '❗︎' : ''),
                            "size": "sm",
                            "color": fish.S_month.indexOf(month) > -1 ? '#ff0000' : '#cccccc',
                            "weight": "bold"
                        }
                    ],
                    "action": {
                        "type": "message",
                        "label": "Yes",
                        "text": `魚-${fish.name_c}`
                    }
                })
                // if (fish.N_month.indexOf(month) > -1 && fish.N_month.indexOf(nextMonth) < 0) {
                //     fishListTemplate.body.contents[j].contents[0].contents.push({
                //         "type": "span",
                //         "text": `❗︎`,
                //         "size": "sm",
                //         "weight": "bold"
                //     })
                // }
                fishListTemplate.body.contents[j].contents.push({
                    "type": "image",
                    "url": `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/fish/${fishIndex}.png`,
                    "size": "md",
                    "action": {
                        "type": "message",
                        "label": "Yes",
                        "text": `魚-${fish.name_c}`
                    }
                })
                // fishListTemplate.body.contents[j].contents.push({
                //     "type": "text",
                //     "text": `${fish.name_c}`,
                //     "align": "center",
                //     "contents": [
                //         {
                //           "type": "span",
                //           "text": `${fish.name_c}`,
                //           "size": "sm",
                //           "decoration": "none"
                //         }
                //     ],
                //     "action": {
                //         "type":"message",
                //         "label":"Yes",
                //         "text": `魚-${fish.name_c}`
                //     }
                // })
                if (k < 5) {
                    fishListTemplate.body.contents[j].contents.push({
                        "type": "separator"
                    })
                }
            }
        }
        carousel.contents.push(JSON.parse(JSON.stringify(fishListTemplate)))
    }

    await context.sendFlex('This is a fish list flex', carousel);
}

async function detail(context) {
    fishName = context.event.text.split('-')[1];
    fish = fishs.find(fish => [fish.index, fish.name_c, fish.name_j, fish.name_e, fish.name_e.toLowerCase()].indexOf(fishName) > -1)

    await context.sendFlex('This is a fish detail flex', createInfo(fish));
}

module.exports.currentFish = currentFish;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;