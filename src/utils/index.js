/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


export { buildUUID, waiting, toast, isPhone, stringify, cropper } from './common'
export { formatTime, timespan, formatByTime } from './time'
export { drawQRCode } from './qrcode'

export const WX_API_SHOW_LOADING = 'WX_API_SHOW_LOADING'

export const allHostURL = Object.freeze({
    dev: 'http://dev.api.com',
    prod: 'https://prod.api.com',
    test: 'http://test.api.com',
    mock: 'http://localhost:3008' //手机调试，换成自己的电脑的ip
})

const target = process.env.NODE_ENV === 'development' ? 'mock' : 'prod'
export const BASE_HOST_URL = allHostURL[target]


