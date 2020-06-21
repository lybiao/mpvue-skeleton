/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


const myinfo = require('./myinfo.json')
const login = require('./login.json')
const reception = require('./reception.json')
const list = require('./reception-list.json')
const detail = require('./admin-mycus-detail.json')
const info = require('./reception-info.json')
const offet = require('./account-offset.json')

module.exports = [
    myinfo,
    login,
    reception,
    list,
    detail,
    info,
    offet
]
