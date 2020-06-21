/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'

export const SET_USER_INFO = 'SET_USER_INFO'
export const UPDATE_USER_INFO = 'UPDATE_USER_INFO'
export const INIT_USER_INFO = 'INIT_USER_INFO'


const initState = {}

const state = {
    user: {
        ...initState
    }
}

const mutations = {
    [SET_USER_INFO](state, user) {
        state.user = user
    },
    [UPDATE_USER_INFO](state, user) {
        state.user = {
            ...state.user,
            ...user
        }
    },
    [INIT_USER_INFO](state) {
        state.user = initState
    }
}

const actions = {
    [SET_USER_INFO]({ commit }, user) {
        const payload = {
            ...mpvue.getStorageSync('token') && { token: mpvue.getStorageSync('token') },
            ...user,
            ...mpvue.getStorageSync('loginPhone') && { phone: mpvue.getStorageSync('loginPhone') }
        }
        mpvue.setStorage({ key: SET_USER_INFO, data: payload })
        commit(SET_USER_INFO, payload)
    },
    [UPDATE_USER_INFO]({ commit, state }, user) {
        const payload = {
            ...mpvue.getStorageSync('token') && { token: mpvue.getStorageSync('token') },
            ...state.user,
            ...user,
            ...mpvue.getStorageSync('loginPhone') && { phone: mpvue.getStorageSync('loginPhone') }
        }
        mpvue.setStorage({ key: SET_USER_INFO, data: payload })
        commit(UPDATE_USER_INFO, payload)
    },
    [INIT_USER_INFO]({ commit }) {
        mpvue.setStorage({ key: SET_USER_INFO, data: initState })
        commit(INIT_USER_INFO)
    }
}

const getters = {
    user: (state) => {
        return state.user
    },
    userInfo: state => state.user
}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}
