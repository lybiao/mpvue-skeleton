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
import VueBus from 'vue-bus'
import App from '@/app.vue'
import store from '@/store'
import { formatTime } from '@/utils'
import AppPlugin from '@/plugin'
import AxiosPlugin from '@/plugin/axios'
import BaseHeader from '@/pages/components/base-header'
import BasePage from '@/pages/components/base-page'


Vue.config.productionTip = false
Vue.config._mpTrace = true
App.mpType = 'app'
Vue.prototype.$store = store

Date.prototype.formatTime = formatTime

Vue.use(AppPlugin)
Vue.use(AxiosPlugin)
Vue.use(VueBus)
Vue.component('BaseHeader', BaseHeader)
Vue.component('BasePage', BasePage)

new Vue({
    ...App,
    store
}).$mount()



