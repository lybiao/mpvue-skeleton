<template>
    <base-page>
        <template slot="header">
            <base-header :title="'客户(' + total + ')'"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="search role-hd" @click="toCustomer(0, total)">
                    <i class="icon-40"></i>
                </div>
                <div class="role-list">
                    <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                        <ul class="hd-list">
                            <li @click="toQrcode">
                                <p class="text">我的个人二维码</p>
                            </li>
                            <li @click="toCustomer(2, mycusState.active_cus)">
                                <p class="text">已激活用户</p>
                                <p class="count did">{{ mycusState.active_cus }}</p>
                            </li>
                            <li @click="toCustomer(1, mycusState.nonactive_cus)">
                                <p class="text">待激活用户</p>
                                <p class="count doing">{{ mycusState.nonactive_cus }}</p>
                            </li>
                        </ul>
                        <h2>消费动态</h2>
                        <ul class="list">
                            <li v-for="(item,index) in list" :key="index">
                                <p class="text">{{ item.name }}</p>
                                <p class="time">{{ item.time }}</p>
                            </li>
                            <li class="nodata" v-if="!list.length&&isloaded" key="nodata">暂时没有客户消费动态</li>
                            <li class="nodata" v-if="!list.length&&pageIndex===1&&!isloaded" key="loading">加载中...</li>
                        </ul>
                    </scroll-view>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_MYCYSSTATE, API_ADMIN_MYCYSCONSUME } from '@/api'


const MAX_SIZE = 20

export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            nomore: false,
            isFetching: false,
            isloaded: false,
            args: {},
            mycusState: {
                active_cus: 0,
                nonactive_cus: 0
            }
        }
    },
    computed: {
        total() {
            return this.mycusState.active_cus + this.mycusState.nonactive_cus
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.getMycusState()
        this.getData()
    },
    onUnload() {
        this.$bus.emit('update:user/role')
    },
    methods: {
        toCustomer(type, total) {
            this.$navigate({
                url: '/pages/customer/customer',
                query: {
                    type,
                    total
                }
            })
        },
        //头部
        getMycusState() {
            this.$http.post(API_ADMIN_MYCYSSTATE).then(res => {
                this.mycusState = { ...this.mycusState, ...res }
            }).catch((erro) => {
                this.$toast(erro)
            })
        },
        getData() {
            if (this.pageIndex === 1) {
                this.isFetching = false
                this.nomore = false
            }
            if (this.nomore || this.isFetching) return
            this.isFetching = true
            this.$http.post(API_ADMIN_MYCYSCONSUME, { page: this.pageIndex, size: MAX_SIZE }).then(data => {
                this.isFetching = false
                this.isloaded = true
                const { list } = data
                if (list.length < MAX_SIZE) this.nomore = true

                list.forEach(item => {
                    item.time = this.$formatTime(item.time, 'M月d日 HH:MM')
                })

                if (this.pageIndex === 1) {
                    this.list = list
                } else {
                    this.list = this.list.concat(list)
                }
                this.pageIndex++
            }).catch((erro) => {
                this.isFetching = false
                this.isloaded = true
                this.$toast(erro)
            })
        },
        toQrcode() {
            this.$navigate({
                url: '/pages/invitation/qrcode'
            })
        }
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .plr {
        padding-left: 29rpx;
        padding-right: 29rpx;
    }

    .role-hd {
        margin: 20rpx 29rpx 50rpx;
        height: 70rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        position: relative;

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: transparent;
        }

        .icon-40 {
            font-size: 36rpx;
            display: inline-block;
            margin: 0 20rpx;
            color: rgba(78, 88, 110, 1);
        }

        .input {
            flex: 1;
            background: rgba(37, 43, 54, 1);
            line-height: 40rpx;
            margin-right: 20rpx;
        }
    }

    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-list {
        flex: 1;
        position: relative;
    }

    .role-list h2 {
        width: 96rpx;
        height: 34rpx;
        font-size: 28rpx;
        color: rgba(171, 171, 171, 1);
        line-height: 40rpx;
        padding-top: 80rpx;
        padding-bottom: 30rpx;
        border-top: 1rpx solid rgba(62, 67, 77, 1);
        border-bottom: 1rpx solid rgba(62, 67, 77, 1);
        width: 100%;
        margin-left: 29rpx;
        font-weight: 400;
    }

    .role-list .hd-list {
        li {
            height: 118rpx;
            line-height: 118;
            font-size: 26rpx;
            font-weight: 400;
            color: rgba(123, 132, 153, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
            padding-left: 29rpx;

            &:active {
                background: rgba(37, 43, 54, 1);
            }

            &::after {
                content: "\e900";
                font-family: icomoon !important;
                font-size: 26rpx;
                color: #ccc;
                line-height: 1;
                vertical-align: -7rpx;
                position: absolute;
                top: 50%;
                right: 29rpx;
                transform: translate(0, -50%);
                color: #97A0B4;
            }

            &::before {
                position: absolute;
                left: 29rpx;
                right: 0;
                top: 0;
                content: "";
                height: 1rpx;
                background-color: rgba(62, 67, 77, 1);
            }
        }

        .text {
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 36rpx;
        }

        .count {
            font-size: 36rpx;
            font-weight: 500;
            line-height: 36rpx;
            padding-right: 70rpx;
        }

        .did {
            color: rgba(244, 99, 135, 1);
        }

        .doing {
            color: rgba(44, 201, 233, 1);
        }
    }

    .role-list .list {
        li {
            border-top: 1rpx solid rgba(62, 67, 77, 1);
            height: 118rpx;
            line-height: 118rpx;
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(123, 132, 153, 1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: 29rpx;

            &.nodata {
                border-top: none;
                text-align: center;
                font-size: 30rpx;
                font-weight: 400;
                color: rgba(110, 116, 129, 1);
                margin-top: 290rpx;
            }

            :active {
                background: rgba(37, 43, 54, 1);
            }
        }

        p {
            display: inline-block;
        }

        .text {
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(123, 132, 153, 1);
            line-height: 42rpx;
            padding-right: 20rpx;
        }
    }
</style>
