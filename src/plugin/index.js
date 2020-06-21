/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


import { toast, timespan, stringify, WX_API_SHOW_LOADING } from '@/utils'


const dealURL = options => {
    const isMark = options.url.includes('?')
    if (!options.query) options.query = {}
    const len = Object.keys(options.query).length !== 0
    if (len) {
        return isMark ? `${options.url}&${stringify(options.query)}` : `${options.url}?${stringify(options.query)}`
    } else {
        return options.url
    }
}

export default {
    install(Vue) {
        Vue.mixin({
            data() {
                return {
                    openmock: true,
                    vlogo: 'http://localhost:3008/imgface.svg'
                }
            }
        })

        Reflect.defineProperty(Vue.prototype, '$navigate', {
            value(options) {
                const isStop = getCurrentPages().length >= 10
                if (isStop) {
                    mpvue.redirectTo({
                        url: decodeURIComponent(dealURL(options))
                    })
                } else {
                    mpvue.navigateTo({
                        url: decodeURIComponent(dealURL(options))
                    })
                }
            }
        })

        Reflect.defineProperty(Vue.prototype, '$redirect', {
            value(options) {
                return mpvue.redirectTo({
                    url: decodeURIComponent(dealURL(options))
                })
            }
        })

        Reflect.defineProperty(Vue.prototype, '$toast', {
            value: toast
        })

        Reflect.defineProperty(Vue.prototype, 'back', {
            value(options = -1) {
                return mpvue.navigateBack({
                    delta: Math.abs(options)
                })
            }
        })


        Reflect.defineProperty(Vue.prototype, '$showLoading', {
            value(options) {
                mpvue.setStorageSync(WX_API_SHOW_LOADING, 'remove')
                mpvue.showLoading(options)
            }
        })
        Reflect.defineProperty(Vue.prototype, '$hideLoading', {
            value(options) {
                mpvue.setStorageSync(WX_API_SHOW_LOADING, '')
                mpvue.hideLoading(options)
            }
        })

        Reflect.defineProperty(Vue.prototype, '$formatTime', {
            value(value, type) {
                if (typeof value == 'string') {
                    value = new Date(value.replace(/-/g, '/'))
                } else {
                    value = new Date(value)
                }
                return value.formatTime(value, type)
            }
        })

        Reflect.defineProperty(Vue.prototype, '$timespan', {
            value: timespan
        })
    }
}

