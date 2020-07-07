const seaCreatures = require('../data/seaCreatures.json');
const util = require('./util');
const style = require('../lib/style');
const ga = require('../lib/ga');

const getAllNames = () => {
    return seaCreatures.map((fish) => `${fish.index}|${fish.name_c}|${fish.name_j}|${fish.name_e}`).join('|')
}

const createInfo = (fish) => {
    const fishDetailTemplate = require('../template/museum_fish.json');
    fishDetailTemplate.styles.header.backgroundColor = style.color.backgroundColor.header;
    fishDetailTemplate.header.contents[0].contents[0].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/fish/${fish.index}.png`;
    fishDetailTemplate.header.contents[0].contents[1].contents[0].text = fish.name_c;
    fishDetailTemplate.header.contents[0].contents[1].contents[1].text = fish.name_j;
    fishDetailTemplate.header.contents[0].contents[1].contents[2].text = fish.name_e;

    fishDetailTemplate.body.contents[0].contents[0].contents[1].text = fish.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    fishDetailTemplate.body.contents[0].contents[1].contents[1].text = fish.place;
    fishDetailTemplate.body.contents[0].contents[2].contents[1].text = fish.time + (fish.remark ? `(${fish.remark})` : '');
    // fishDetailTemplate.body.contents[1].contents[3].contents[1].text = fish.shadow_size;

    for (let i = 0; i < 6; i++) {
        fishDetailTemplate.body.contents[3].contents[i].color = style.color.select[fish.N_month[i]];
        fishDetailTemplate.body.contents[7].contents[i].color = style.color.select[fish.S_month[i]];

        fishDetailTemplate.body.contents[4].contents[i].color = style.color.select[ fish.N_month[i + 6]];
        fishDetailTemplate.body.contents[8].contents[i].color = style.color.select[fish.S_month[i + 6]];
    }

    fishDetailTemplate.footer.contents[0].text =`魚影級別為： ${fish.shadow_size}`;
    for (let i = 1; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            fishDetailTemplate.footer.contents[i].contents[j].contents[1].color = '#000000';
        }
    }

    if (fish.shadow_size === '極小'){
        fishDetailTemplate.footer.contents[1].contents[0].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '小'){
        fishDetailTemplate.footer.contents[1].contents[1].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '中'){
        fishDetailTemplate.footer.contents[1].contents[2].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '背鰭'){
        fishDetailTemplate.footer.contents[1].contents[3].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '大'){
        fishDetailTemplate.footer.contents[2].contents[0].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '特大'){
        fishDetailTemplate.footer.contents[2].contents[1].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '超特大'){
        fishDetailTemplate.footer.contents[2].contents[2].contents[1].color = style.color.select[true];
    } else if (fish.shadow_size === '細長'){
        fishDetailTemplate.footer.contents[2].contents[3].contents[1].color = style.color.select[true];
    }

    return fishDetailTemplate
}

async function currentSeaCreatures(context) {
    let month = new Date().getMonth() + 1;
    if (context.event.text.match(/[-\s]/i)) {
        month = context.event.text.split(/[-\s]/)[1].replace('月', '') - 0;
    }

    // ga.gaEventLabel(context.session.user.id, 'fish', 'list', month);
    await context.sendFlex('海底生物類清單一覽', util.currentListNew(month, 'seaCreatures', seaCreatures));
}

async function detail(context) {
    const fishName = context.event.text.split(/[-\s]/)[1];
    const fish = fishs.find(fish => [fish.index, fish.name_c, fish.name_j, fish.name_e, fish.name_e.toLowerCase()].indexOf(fishName) > -1);
    
    ga.gaEventLabel(context.session.user.id, 'fish', 'detail', fish.name_c);
    await context.sendFlex(`${fishName} 詳細資料`, createInfo(fish));
}

module.exports.currentSeaCreatures = currentSeaCreatures;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;