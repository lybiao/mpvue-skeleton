/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import modules from './modules'

const logger = createLogger()
const debug = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)


export default new Vuex.Store({
    modules,
    strict: debug,
    plugins: debug ? [logger] : []
})

