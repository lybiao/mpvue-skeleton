/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


import Axios from 'axios'
import { BASE_HOST_URL } from '@/utils'
import { API_LOGIN } from '@/api'


let baseURL = BASE_HOST_URL


const tipMsg = {
    common: '网络错误',
    timeout: '请求超时',
    fail: '服务无响应',

    400: '错误请求',
    401: '缺少参数',
    404: '接口URL错误',
    403: '服务器拒绝请求',
    405: '请求的方式错误',
    500: '服务器内部错误',
    502: '错误网关',
    503: '服务不可用',
    504: '网关超时',

    domain: '域名不在白名单',
    ssl: 'SSL证书校验错误',
    associated: '没关联的主机名'
}


const codes = Object.keys(tipMsg)

const defaultCtrl = {
    isMsg: true
}

/*异常 */
function exception({ res, ctrl }) {
    const errMsg = res.errMsg
    let type = 'common'
    if (errMsg.includes('fail')) {
        if (errMsg.includes('domain')) type = 'domain'
        if (errMsg.includes('ssl hand')) type = 'ssl'
        if (errMsg.includes('associated')) type = 'associated'
        if (errMsg == 'request:fail ' || errMsg.includes('unexpected end')) type = 'fail'
        if (errMsg.includes('timeout') || errMsg.includes('网络')) type = 'timeout'
    } else {
        if (codes.includes(res.statusCode)) type = res.statusCode
    }
    if (ctrl.isMsg) {
        return Promise.reject(tipMsg[type])
    } else {
        return Promise.reject({
            code: res.statusCode,
            message: tipMsg[type]
        })
    }
}


/*成功*/
function success({ res, ctrl }) {
    return new Promise((resolve, reject) => {
        const code = res.data.code
        if (code === 0) {
            resolve(res.data.data)
        } else {
            // 捕获信息体
            if (ctrl.isMsg) {
                reject(res.data.message)
            } else {
                reject(res.data)
            }
        }
    })
}


export default {
    install(Vue) {
        Axios.defaults.timeout = 6000
        Axios.defaults.baseURL = baseURL
        Axios.defaults.headers.post['Content-Type'] = 'application/json'

        Axios.defaults.adapter = function (config) {
            if (!config.ctrl) config.ctrl = {}
            if (!config.data) config.data = JSON.stringify({})
            config.ctrl = Object.assign({}, defaultCtrl, config.ctrl, { path: config.url })

            let header = {
                'Auth-Token': mpvue.getStorageSync('token'),
                'Auth-Role': 'miniprograme'
            }

            if (!header.token) delete header.token
            header = Object.assign(header, config.header)

            return new Promise((resolve, reject) => {
                let data = config.method === 'get' ? config.params : config.data
                mpvue.request({
                    url: config.url,
                    method: config.method,
                    data: data,
                    header: header,
                    complete: (res) => {
                        if (res.statusCode === 200) {
                            success({ res, ctrl: { ...config.ctrl } }).then(res => {
                                resolve(res)
                                //缓存 token
                                if (config.url.includes(API_LOGIN)) {
                                    mpvue.setStorage({ key: 'token', data: res.token })
                                }
                            }).catch(error => {
                                reject(error)
                            })
                        } else {
                            exception({ res, ctrl: { ...config.ctrl } }).catch(error => {
                                reject(error)
                            })
                        }
                    }
                })
            })
        }

        Vue.prototype.$http = Axios
    }
}




