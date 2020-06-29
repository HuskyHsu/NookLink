const axios = require('axios')
const Qs = require('qs')

const PAYLOAD_DEFAULT = {
  aip: 1, // 忽略追蹤發送者 IP
  an: 'NookLink', // App Name
  av: '1.0.0', // App 版號
  de: 'UTF-8', // 字元編碼
  ds: 'app', // 資料來源，填寫為 app
  tid: 'UA-89553979-6', // GA 追蹤代碼
  ul: 'zh-tw', // locale
  v: 1, // api version
}

const httpBuildQuery = obj => Qs.stringify(obj, { arrayFormat: 'brackets' })

const transformLineId = lineId => ({
  uid: lineId,
  cid: lineId.replace(/^U(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})$/, '$1-$2-$3-$4-$5'),
})

function gaScreenView (lineId, name, overrides = {}) {
  return axios.post('https://www.google-analytics.com/collect', httpBuildQuery({
    ...PAYLOAD_DEFAULT,
    ...overrides,
    ...transformLineId(lineId),
    t: 'screenview',
    cd: name,
  }))
}

function gaEventLabel (lineId, category, action, label, overrides = {}) {
  return axios.post('https://www.google-analytics.com/collect', httpBuildQuery({
    ...PAYLOAD_DEFAULT,
    ...overrides,
    ...transformLineId(lineId),
    t: 'event',
    ec: category,
    ea: action,
    el: label,
  }))
}

module.exports.gaEventLabel = gaEventLabel;
module.exports.gaScreenView = gaScreenView;