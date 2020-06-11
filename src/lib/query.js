const findOne = (items, name) => {
    return items.find(item => [item.index, item.name_c, item.name_j, item.name_e, item.name_e.toLowerCase()].indexOf(name) > -1);
}

const filter = (items, attrs, target) => {
    return items.filter(item => {
        return attrs.some((attr) => {
            if (typeof item[attr] === 'string'){
                return item[attr].toLowerCase().indexOf(target) > -1
            } else if (Array.isArray(item[attr])) {
                return item[attr].some((i) => {
                    if (typeof i === 'string') {
                        return i.toLowerCase().indexOf(target) > -1
                    } else if (typeof i === 'object') {
                        return Object.values(i).some((value) => {
                            return value.toString().indexOf(target) > -1
                        })
                    }
                })
            }
        })
    })
}

const getAllNames = (items) => {
    return items.map((item) => `${item.name_c}|${item.name_j}|${item.name_e}}`).join('|')
}

module.exports.findOne = findOne;
module.exports.filter = filter;
module.exports.getAllNames = getAllNames;