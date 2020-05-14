const findOne = (items, name) => {
    return items.find(item => [item.index, item.name_c, item.name_j, item.name_e, item.name_e.toLowerCase()].indexOf(name) > -1);
}

const filter = (items, attrs, target) => {
    return items.filter(item => {
        return attrs.some((attr) => {
            if (typeof item[attr] === 'string'){
                return item[attr].indexOf(target) > -1
            } else {
                return item[attr].indexOf(target) > -1
            }
        })
    })
}

const getAllNames = (items) => {
    return items.map((item) => `${item.name_c}|${item.name_j}|${item.name_e}|${item.name_e.toLowerCase()}`).join('|')
}

module.exports.findOne = findOne;
module.exports.filter = filter;
module.exports.getAllNames = getAllNames;