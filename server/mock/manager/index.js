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
const home = require('./admin-home.json')
const list = require('./admin-profit-list.json')
const detail = require('./admin-profit-detail.json')
const detailList = require('./admin-profit-detail-list.json')
const cusList = require('./admin-profit-cus-list.json')
const dayDetail = require('./admin-profit-day-detail.json')
const roomList = require('./checkin-room-list.json')
const manageList = require('./admin-manage-list.json')
const freezeList = require('./admin-manage-freeze-list.json')
const id = require('./account-info-id.json')
const am = require('./account-logs-am.json')


module.exports = [
    login,
    home,
    list,
    detail,
    detailList,
    cusList,
    dayDetail,
    roomList,
    manageList,
    freezeList,
    id,
    am
]
