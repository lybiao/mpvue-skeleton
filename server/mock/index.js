/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'



//收银台： 18000000001: 'api/checkout/login',
//管理员： 18000000002: 'api/manager/login',
//部  长： 18000000003: 'api/minister/login',
//前台： 18000000004: 'api/reception/login'

const base = require('./base')
const checkout = require('./checkout')
const manager = require('./manager')
const minister = require('./minister')
const reception = require('./reception')

let apis = [
    ...base,
    ...checkout,
    ...manager,
    ...minister,
    ...reception
]


//json中重复的接口保留最后一个
const unique = apis => {
    let newMap = new Map()
    let repeatApi = {}
    let newApis = []

    apis.forEach(api => {
        if (newMap.has(api.url)) {
            let currentApi = newMap.get(api.url)
            if (currentApi.data.code !== 0) {
                newMap.set(api.url, api)
            }
            repeatApi[api.url] = repeatApi[api.url] ? repeatApi[api.url]++ : 1
        } else {
            newMap.set(api.url, api)
        }
    })

    for (let [key, value] of newMap) {
        newApis.push(value)
    }

    return newApis
}


module.exports = unique(apis)



