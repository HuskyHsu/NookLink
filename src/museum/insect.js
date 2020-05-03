insects = require('../data/insect.json');
util = require('./util');

const getAllNames = () => {
    return insects.map((insect) => `${insect.index}|${insect.name_c}|${insect.name_j}|${insect.name_e}|${insect.name_e.toLowerCase()}`).join('|')
}

const createInfo = (insect) => {
    const insectDetailTemplate = require('../template/insect_detail.json');
    insectDetailTemplate.body.contents[0].contents[0].url = `https://raw.githubusercontent.com/HuskyHsu/NookAssets/master/img/insect/${insect.index}.png`;
    insectDetailTemplate.body.contents[0].contents[1].contents[0].text = insect.name_c;
    insectDetailTemplate.body.contents[0].contents[1].contents[1].text = insect.name_j;
    insectDetailTemplate.body.contents[0].contents[1].contents[2].text = insect.name_e;

    insectDetailTemplate.body.contents[1].contents[0].contents[1].text = insect.price.toString();
    insectDetailTemplate.body.contents[1].contents[1].contents[1].text = insect.place + (insect.remark ? `(${insect.remark})` : '');
    insectDetailTemplate.body.contents[1].contents[2].contents[1].text = insect.time + (insect.weather !== '無影響' ? `(${insect.weather})` : '');

    for (let i = 0; i < 6; i++) {
        insectDetailTemplate.body.contents[5].contents[i].color = util.fontColor.select[insect.N_month[i]];
        insectDetailTemplate.body.contents[9].contents[i].color = util.fontColor.select[insect.S_month[i]];

        insectDetailTemplate.body.contents[6].contents[i].color = util.fontColor.select[ insect.N_month[i + 6]];
        insectDetailTemplate.body.contents[10].contents[i].color = util.fontColor.select[insect.S_month[i + 6]];
    }

    return insectDetailTemplate
}

async function currentInsect(context) {
    let month = new Date().getMonth() + 1;
    if (context.event.text.indexOf('-') > -1) {
        month = context.event.text.split('-')[1].replace('月', '') - 0;
    }

    await context.sendFlex('This is a insect list flex', util.currentList(month, 'insect', insects));
}

async function detail(context) {
    const insectName = context.event.text.split('-')[1];
    const insect = insects.find(insect => [insect.index, insect.name_c, insect.name_j, insect.name_e, insect.name_e.toLowerCase()].indexOf(insectName) > -1);

    await context.sendFlex('This is a insect detail flex', createInfo(insect));
}

module.exports.currentInsect = currentInsect;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;