/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


import { mapGetters } from 'vuex'


export const BaseMixin = {
    data() {
        return {
            navTop: {
                common: 74,
                iphoneX: 90
            }
        }
    },
    computed: {
        ...mapGetters(['menuRect', 'iphoneX', 'systemInfo'])
    }
}




