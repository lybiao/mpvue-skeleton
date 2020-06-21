/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */

'use strict';

const modulesFiles = require.context('@/store', true, /\.js$/)
const filters = ['index', 'modules']

function modifyKeyName(moduleName) {
    moduleName = moduleName.replace('/index', '')
    let words = []
    let word = ''
    if (moduleName.includes('-')) {
        words = moduleName.split('-')
    } else {
        words.push(moduleName)
    }
    words.map(item => {
        word += item.slice(0, 1).toUpperCase() + item.slice(1)
    })
    return word
}

const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    let moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
    if (!filters.includes(moduleName)) {
        const value = modulesFiles(modulePath)
        moduleName = modifyKeyName(moduleName)
        modules[moduleName] = value.default
    }

    return modules
}, {})


export default modules


