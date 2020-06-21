/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


const login = require('./login.json')
const home = require('./account-reward-home.json')
const rewardList = require('./account-reward-list.json')
const profitList = require('./admin-profit-list.json')
const profitDetail = require('./admin-profit-detail.json')
const profitDetailList = require('./admin-profit-detail-list.json')
const add = require('./admin-add.json')
const stat = require('./admin-mycus-stat.json')
const consume = require('./admin-mycus-consume.json')
const mycus = require('./admin-mycus.json')
const mycusDetail = require('./admin-mycus-detail.json')
const qrcode = require('./qrcode-create.json')


module.exports = [
    login,
    home,
    rewardList,
    profitList,
    profitDetail,
    profitDetailList,
    add,
    stat,
    consume,
    mycus,
    mycusDetail,
    qrcode
]
