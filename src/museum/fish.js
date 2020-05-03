fishs = require('../data/fish.json');
util = require('./util');

getAllNames = () => {
    return fishs.map((fish) => `${fish.index}|${fish.name_c}|${fish.name_j}|${fish.name_e}|${fish.name_e.toLowerCase()}`).join('|')
}

createInfo = (fish) => {
    fishDetailTemplate = require('../template/fish_detail.json');
    fishDetailTemplate.body.contents[0].contents[0].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/fish/${fish.index}.png`;
    fishDetailTemplate.body.contents[0].contents[1].contents[0].text = fish.name_c;
    fishDetailTemplate.body.contents[0].contents[1].contents[1].text = fish.name_j;
    fishDetailTemplate.body.contents[0].contents[1].contents[2].text = fish.name_e;

    fishDetailTemplate.body.contents[1].contents[0].contents[1].text = fish.price.toString();
    fishDetailTemplate.body.contents[1].contents[1].contents[1].text = fish.place;
    fishDetailTemplate.body.contents[1].contents[2].contents[1].text = fish.time + (fish.remark ? `(${fish.remark})` : '');
    // fishDetailTemplate.body.contents[1].contents[3].contents[1].text = fish.shadow_size;

    for (let i = 0; i < 6; i++) {
        fishDetailTemplate.body.contents[5].contents[i].color = util.fontColor.select[fish.N_month[i]];
        fishDetailTemplate.body.contents[9].contents[i].color = util.fontColor.select[fish.S_month[i]];

        fishDetailTemplate.body.contents[6].contents[i].color = util.fontColor.select[ fish.N_month[i + 6]];
        fishDetailTemplate.body.contents[10].contents[i].color = util.fontColor.select[fish.S_month[i + 6]];
    }

    fishDetailTemplate.footer.contents[0].text =`魚影級別為： ${fish.shadow_size}`;
    for (let i = 1; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            fishDetailTemplate.footer.contents[i].contents[j].contents[1].color = '#000000';
        }
    }

    if (fish.shadow_size === '極小'){
        fishDetailTemplate.footer.contents[1].contents[0].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '小'){
        fishDetailTemplate.footer.contents[1].contents[1].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '中'){
        fishDetailTemplate.footer.contents[1].contents[2].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '背鰭'){
        fishDetailTemplate.footer.contents[1].contents[3].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '大'){
        fishDetailTemplate.footer.contents[2].contents[0].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '特大'){
        fishDetailTemplate.footer.contents[2].contents[1].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '超特大'){
        fishDetailTemplate.footer.contents[2].contents[2].contents[1].color = util.fontColor.select[true];
    } else if (fish.shadow_size === '細長'){
        fishDetailTemplate.footer.contents[2].contents[3].contents[1].color = util.fontColor.select[true];
    }

    return fishDetailTemplate
}

async function currentFish(context) {
    let month = new Date().getMonth() + 1;
    if (context.event.text.indexOf('-') > -1) {
        month = context.event.text.split('-')[1].replace('月', '') - 0;
    }

    await context.sendFlex('This is a fish list flex', util.currentList(month, 'fish', fishs));
}

async function detail(context) {
    fishName = context.event.text.split('-')[1];
    fish = fishs.find(fish => [fish.index, fish.name_c, fish.name_j, fish.name_e, fish.name_e.toLowerCase()].indexOf(fishName) > -1)

    await context.sendFlex('This is a fish detail flex', createInfo(fish));
}

module.exports.currentFish = currentFish;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;