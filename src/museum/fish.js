fishs = require('../data/fish.json');


async function currentFish(context) {
    month = new Date().getMonth() + 1;
    f = fishs.filter((fish) => {
        return fish.S_month.indexOf(month) > -1
    }).map((fish) => fish.name_c).join('、');

    await context.sendText(JSON.stringify(f));
}

async function detail(context) {
    fish = fishs.filter((fish) => fish.name_c == '浪人鰺')[0];

    await context.sendFlex('This is a hello world flex', {
        type: 'bubble',
        body: {
            type: 'box',
            layout: 'horizontal',
            contents: [{
                    type: 'text',
                    text: 'Hello,',
                },
                {
                    type: 'text',
                    text: 'World!',
                },
            ],
        },
    });
}

module.exports.currentFish = currentFish;
module.exports.detail = detail;