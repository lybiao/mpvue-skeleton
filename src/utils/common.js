/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


export const waiting = (interval = 500) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, interval)
    })
}


export const buildUUID = () => {
    let time = new Date().getTime()
    let uuid = 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = (time + Math.random() * 16) % 16 | 0
        time = Math.floor(time / 16)
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
    return uuid
}


export function toast(options) {
    let o = {
        icon: 'none',
        title: ''
    }
    typeof (options) === 'object' ? o = Object.assign(o, options) : o.title = options
    if (typeof (o.title) === 'number') o.title = `${o.title}`
    if (o.title === null || o.title === '' || o.title === undefined) return false
    mpvue.showToast(o)
}


export const isPhone = /^(13[0-9]|14[0-9]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|17[0-9]|16[5-8]|19[0-9])\d{8}$/


const toString = Object.prototype.toString
export const stringify = o => {
    const query = Object.keys(o)
    let str = ''
    query.forEach((key, index) => {
        let val
        if (toString.call(o[key]) === '[object Array]' || toString.call(o[key]) === '[object Object]') {
            val = JSON.stringify(o[key])
        } else {
            val = o[key]
        }
        str += `${key}=${val}${index < query.length - 1 ? '&' : ''}`
    })
    return str
}


const choose = (type) => {
    return new Promise((resolve, reject) => {
        mpvue.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: [type],
            success: (res) => {
                let tempFilePath = res.tempFilePaths[0]
                resolve(tempFilePath)
            },
            fail: () => {
                reject('选择图片失败')
            }
        })
    })
}
let types = ['album', 'camera']


export const cropper = () => {
    return new Promise((resolve, reject) => {
        mpvue.showActionSheet({
            itemList: ['从相册中选择', '拍照'],
            itemColor: '#000',
            success: (res) => {
                if (res.cancel) {
                    reject('取消')
                    return false
                }
                choose(types[res.tapIndex]).then(tempFilePath => {
                    resolve(tempFilePath)
                }).catch(error => {
                    reject(error)
                })
            }
        })
    })
}
