const seaCreatures = require('../data/seaCreatures.json');
const util = require('./util');
const style = require('../lib/style');
const ga = require('../lib/ga');

const getAllNames = () => {
    return seaCreatures.map((fish) => `${fish.index}|${fish.name_c}|${fish.name_j}|${fish.name_e}`).join('|')
}

const createInfo = (item) => {
    const template = require('../template/museum_seaCreatures.json');
    template.styles.header.backgroundColor = style.color.backgroundColor.header;
    template.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/MenuIcon/${item.filename}.png`;
    template.header.contents[0].contents[1].contents[0].text = item.name_c;
    template.header.contents[0].contents[1].contents[1].text = item.name_j;
    template.header.contents[0].contents[1].contents[2].text = item.name_e;

    template.body.contents[0].contents[0].contents[1].text = item.Sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    template.body.contents[0].contents[1].contents[1].text = item.Shadow;
    template.body.contents[0].contents[2].contents[1].text = item['Movement Speed'];
    template.body.contents[2].contents[0].contents[1].text = item.N_month.find((m) => m != null);
    template.body.contents[2].contents[1].contents[1].text = item['Total Catches to Unlock'].toString();
    template.body.contents[2].contents[2].contents[1].text = `${item['Spawn Rates'].toString()}%`;

    for (let i = 0; i < 6; i++) {
        template.body.contents[5].contents[i].color = style.color.select[item.N_month[i] != null];
        template.body.contents[9].contents[i].color = style.color.select[item.S_month[i] != null];

        template.body.contents[6].contents[i].color = style.color.select[ item.N_month[i + 6] != null];
        template.body.contents[10].contents[i].color = style.color.select[item.S_month[i + 6] != null];
    }

    return template
}

async function currentSeaCreatures(context) {
    let month = new Date().getMonth() + 1;
    if (context.event.text.match(/[-\s]/i)) {
        month = context.event.text.split(/[-\s]/)[1].replace('月', '') - 0;
    }

    ga.gaEventLabel(context.session.user.id, 'seaCreatures', 'list', month);
    await context.sendFlex('海底生物類清單一覽', util.currentListNew(month, 'seaCreatures', seaCreatures));
}

async function detail(context) {
    const name = context.event.text.split(/[-\s]/)[1];
    const seaCreature = seaCreatures.find(item => [item.index, item.name_c, item.name_j, item.name_e, item.name_e.toLowerCase()].indexOf(name) > -1);
    
    ga.gaEventLabel(context.session.user.id, 'seaCreatures', 'detail', seaCreature.name_c);
    await context.sendFlex(`${name} 詳細資料`, createInfo(seaCreature));
}

module.exports.currentSeaCreatures = currentSeaCreatures;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;