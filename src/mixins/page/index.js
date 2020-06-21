/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'

import { WX_API_SHOW_LOADING } from '@/utils'


export const PageMixin = {
    onUnload() {
        const flag = mpvue.getStorageInfoSync(WX_API_SHOW_LOADING)
        if (flag && flag == 'remove') {
            this.$hideLoading()
        }
    }
}
