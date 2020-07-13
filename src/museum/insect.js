const insects = require('../data/insects.json');
const util = require('./util');
const style = require('../lib/style');
const ga = require('../lib/ga');

const getAllNames = () => {
    return insects.map((insect) => `${insect.index}|${insect.name_c}|${insect.name_j}|${insect.name_e}`).join('|')
}

const createInfo = (item) => {
    const template = require('../template/museum_insect.json');
    template.styles.header.backgroundColor = style.color.backgroundColor.header;
    template.header.contents[0].contents[0].url = `https://acnhcdn.com/latest/MenuIcon/${item.filename}.png`;
    template.header.contents[0].contents[1].contents[0].text = item.name_c;
    template.header.contents[0].contents[1].contents[1].text = item.name_j;
    template.header.contents[0].contents[1].contents[2].text = item.name_e;

    template.body.contents[0].contents[0].contents[1].text = item.Sell.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    template.body.contents[0].contents[1].contents[1].text = item.Weather;
    template.body.contents[0].contents[2].contents[1].text = item.N_month.find((m) => m != null);
    template.body.contents[2].contents[0].contents[1].text = `${item['Total Catches to Unlock']}/${item['Spawn Rates'].toString()}%`;
    template.body.contents[2].contents[1].contents[1].text = item['Where/How'].replace('(', '\n(');

    for (let i = 0; i < 6; i++) {
        template.body.contents[5].contents[i].color = style.color.select[item.N_month[i] != null];
        template.body.contents[9].contents[i].color = style.color.select[item.S_month[i] != null];

        template.body.contents[6].contents[i].color = style.color.select[ item.N_month[i + 6] != null];
        template.body.contents[10].contents[i].color = style.color.select[item.S_month[i + 6] != null];
    }

    return template
}

async function currentInsect(context) {
    let month = new Date().getMonth() + 1;
    if (context.event.text.match(/[-\s]/i)) {
        month = context.event.text.split(/[-\s]/)[1].replace('月', '') - 0;
    }

    ga.gaEventLabel(context.session.user.id, 'insect', 'list', month);
    await context.sendFlex('蟲類清單一覽', util.currentList(month, 'insects', insects, {showName: true}));
}

async function detail(context) {
    const insectName = context.event.text.split(/[-\s]/)[1];
    const insect = insects.find(insect => [insect.index, insect.name_c, insect.name_j, insect.name_e, insect.name_e.toLowerCase()].indexOf(insectName) > -1);

    ga.gaEventLabel(context.session.user.id, 'insect', 'detail', insect.name_c);
    await context.sendFlex(`${insectName} 詳細資料`, createInfo(insect));
}

module.exports.currentInsect = currentInsect;
module.exports.detail = detail;
module.exports.getAllNames = getAllNames;