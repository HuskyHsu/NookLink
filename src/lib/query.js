const findOne = (items, name) => {
    return items.find(item => [item.index, item.name_c, item.name_j, item.name_e, item.name_e.toLowerCase()].indexOf(name) > -1);
}

const getAllNames = (items) => {
    return items.map((item) => `${item.name_c}|${item.name_j}|${item.name_e}|${item.name_e.toLowerCase()}`).join('|')
}

module.exports.findOne = findOne;
module.exports.getAllNames = getAllNames;