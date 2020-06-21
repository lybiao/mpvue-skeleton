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
const stat = require('./checkstand-stat.json')
const list = require('./checkstand-list.json')
const search = require('./account-search.json')
const id = require('./account-info-id.json')
const info = require('./account-info.json')
const offset = require('./account-offset.json')

module.exports = [
    login,
    stat,
    list,
    search,
    id,
    info,
    offset
]
