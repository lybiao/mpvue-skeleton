<template>
    <base-page>
        <template slot="header">
            <base-header @left="toExit" :custom-return="true" left-type="exit" title="管理员"></base-header>
        </template>
        <template slot="main">
            <div class="content">
                <div class="tipbox">
                    <div class="number" @click.stop="toOperate">账号管理</div>
                </div>
                <div class="itembox">
                    <div class="item v-mask-before-3" v-for="(item,index) in roleList" :key="index" :class="'bg'+(index+1)" @click.stop="toDetail(item)">
                        <p>{{ item.role }}</p>
                        <p>{{ info[item.name] }}</p>
                    </div>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ADMIN_HOME } from '@/api'


export default {
    mixins: [PageMixin],
    data() {
        return {
            info: {},
            tips: 0,
            roleList: [
                { role: '部长', name: 'bz_zount' },
                { role: '总监', name: 'zz_count' },
                { role: '经理', name: 'jl_count' },
                { role: '客户', name: 'kh_count' }
            ]
        }
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
        this.getData()
    },
    methods: {
        getData() {
            this.$http.post(API_ADMIN_HOME).then(data => {
                this.info = data.info
                this.tips = data.tips
            }).catch(error => {
                this.$toast(error)
            })
        },
        toDetail(item) {
            if (item.role == '客户') {
                this.$navigate({
                    url: '/pages/manager/customer',
                    query: {
                        type: 'customer'
                    }
                })
                return false
            }

            let roleMap = {
                经理: 'manager',
                部长: 'minister',
                总监: 'director'
            }
            this.$navigate({
                url: '/pages/manager/member-detail',
                query: {
                    type: roleMap[item.role]
                }
            })
        },
        toExit() {
            this.$navigate({
                url: '/pages/user/exit'
            })
        },
        toOperate() {
            this.$navigate({
                url: '/pages/manager/operate'
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .content {
        padding: 30rpx;
    }

    .content .tipbox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 50rpx;
    }

    .content .tipbox .number {
        flex: 1;
        height: 120rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 24rpx;
        background-color: #252b36;
        color: #bbc2d2;
        font-size: 30rpx;
        text-align: center;
        line-height: 120rpx;
    }

    .content .tipbox .number:active {
        background-color: #50555e;
    }

    .content .tipbox .application {
        position: relative;
    }

    .content .tipbox .application span {
        position: absolute;
        min-width: 15rpx;
        padding: 0 10rpx;
        height: 35rpx;
        border-radius: 35rpx;
        background-color: #f00;
        color: #fff;
        font-size: 22rpx;
        font-weight: bold;
        right: -10rpx;
        top: -18rpx;
        text-align: center;
        line-height: 35rpx;
    }

    .content .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 182rpx;
        border-radius: 24rpx;
        padding: 0 26rpx 0 41rpx;
        color: #fff;
        font-size: 40rpx;
        margin-bottom: 26rpx;
        position: relative;
        background-color: #252b36;
    }

    .content .item:after {
        content: "\e900";
        font-family: icomoon !important;
        font-size: 32rpx;
        color: #fff;
        line-height: 1;
        margin-left: 24rpx;
    }

    .content .item p:first-child {
        width: 300rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .content .item p:last-child {
        text-align: right;
        flex: 1;
    }


    .content .item.bg4 {
        margin-top: 100rpx;
    }

    .content .item.bg4:before {
        content: "";
        height: 1rpx;
        background-color: #3e434d;
        position: absolute;
        left: 0;
        right: 0;
        top: -50rpx;
    }
</style>
