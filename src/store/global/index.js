/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'

export const SET_SYSTEM_INFO = 'SET_SYSTEM_INFO'
export const SET_MENU_BTN_RECT = 'SET_MENU_BTN_RECT'


export const likeIphoneX = [
    'iPhone X',
    'MI 8 Lite',
    'JSN-AL00a'
]

export const isLikeIphoneX = (device) => likeIphoneX.findIndex(item => device.includes(item)) > -1


//获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点。
//>= 2.1 支持
const canIUse = mpvue.canIUse('getMenuButtonBoundingClientRect')

const state = {
    systemInfo: {},
    menuRect: {}
}

const mutations = {
    [SET_SYSTEM_INFO](state, systemInfo) {
        state.systemInfo = systemInfo
    },
    [SET_MENU_BTN_RECT](state, menuRect) {
        state.menuRect = menuRect
    }
}


const actions = {
    [SET_SYSTEM_INFO](context) {
        const systemInfo = mpvue.getSystemInfoSync()
        context.commit(SET_SYSTEM_INFO, systemInfo)
    },
    [SET_MENU_BTN_RECT]({ commit }) {
        return new Promise((resolve, reject) => {
            let rect = {}
            if (!canIUse) {
                const systemInfo = mpvue.getSystemInfoSync()
                rect = {
                    height: 32,
                    width: 87,
                    top: systemInfo.model.includes('iPhone X') ? 50 : 26,
                    right: systemInfo.windowWidth - 10,
                    left: systemInfo.windowWidth - 10 - 87,
                    bottom: isLikeIphoneX(systemInfo.model) ? 82 : 58
                }
                reject()
            } else {
                rect = mpvue.getMenuButtonBoundingClientRect()
                resolve()
            }
            commit(SET_MENU_BTN_RECT, rect)
        })
    }
}


const getters = {
    systemInfo: state => state.systemInfo,
    menuRect: state => state.menuRect,
    iphoneX: state => state.systemInfo.model && isLikeIphoneX(state.systemInfo.model) || state.menuRect.top > 36

}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}
