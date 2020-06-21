<template>
    <base-page>
        <template slot="header">
            <base-header :title="args.type ? (title + '(' + args.total + ')') : '搜索'"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="search role-hd" v-if="role==='minister'">
                    <i class="icon-40"></i>
                    <input type="text" v-model.trim="serachKey">
                </div>
                <div class="role-list" :class="{active: role==='minister'}">
                    <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                        <ul class="list">
                            <li @click="toDetail(item)" v-for="item in list" :key="item.id">
                                {{ item.name }}
                                <i>{{ item.time }}</i>
                            </li>
                        </ul>
                        <template v-if="!list.length">
                            <div class="tip" v-if="isloaded">{{ msgTip }}</div>
                            <div class="tip" v-if="!list.length && pageIndex===1 && !isloaded">加载中...</div>
                        </template>
                    </scroll-view>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_MYCYS } from '@/api'


const MAX_SIZE = 20
const titles = {
    1: '待激活用户',
    2: '已激活用户',
    0: '客户'
}
const msgTip = {
    1: '暂时没有待激活客户',
    2: '暂时没有已激活客户',
    0: '暂时没有客户'
}


export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            nomore: false,
            isFetching: false,
            args: {
                total: 0
            },
            isloaded: false,
            title: '',
            // 角色区分
            role: 'minister',
            serachKey: '',
            timer: null
        }
    },
    computed: {
        msgTip() {
            return msgTip[this.args.type || '0']
        }
    },
    watch: {
        serachKey() {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.reset()
                this.submitSearch()
            }, 500)
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.title = titles[this.args.type || 0]
        this.getData()
    },
    methods: {
        reset() {
            this.pageIndex = 1
            this.nomore = false
            this.isFetching = false
            this.pageIndex = 1
            this.list = []
            this.isloaded = false
        },
        submitSearch() {
            this.getData()
        },
        toDetail(item) {
            this.$navigate({
                url: '/pages/customer/detail',
                query: {
                    id: item.id
                }
            })
        },
        getData() {
            if (this.pageIndex === 1) {
                this.isFetching = false
                this.nomore = false
            }
            if (this.nomore || this.isFetching) return
            this.isFetching = true
            this.$http.post(API_ADMIN_MYCYS, { page: this.pageIndex, size: MAX_SIZE, type: parseInt(this.args.type), ...this.serachKey && { key: this.serachKey } }).then(data => {
                this.isFetching = false
                this.isloaded = true
                const { list } = data
                if (list.length < MAX_SIZE) this.nomore = true

                list.forEach(item => {
                    item.time = this.$formatTime(item.time, 'MM月dd日 HH:mm:ss')
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
        }
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-hd {
        margin: 24rpx 30rpx 50rpx;
        height: 76rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        position: relative;

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: transparent;
        }

        .icon-40 {
            font-size: 34rpx;
            display: inline-block;
            margin: 0 20rpx;
            color: rgba(78, 88, 110, 1);
        }

        input {
            flex: 1;
            background: rgba(37, 43, 54, 1);
            line-height: 40rpx;
            margin-right: 20rpx;
            color: #fff;
            font-size: 26rpx;
        }
    }

    .role-list {
        margin-top: 149rpx;
        flex: 1;
        position: relative;
        overflow: hidden;
        &.active {
            margin-top: 0;
        }

        .tip {
            font-size: 26rpx;
            font-weight: 400;
            color: rgba(110, 116, 129, 1);
            line-height: 36rpx;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9;
        }
    }

    .role-list .list {
        li {
            height: 118rpx;
            line-height: 118rpx;
            font-size: 30rpx;
            font-weight: 400;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            padding: 0 29rpx;
            display: flex;
            justify-content: space-between;
            i {
                font-size: 30rpx;
                color: #888;
            }

            &:first-child::before, &::after {
                position: absolute;
                left: 29rpx;
                content: "";
                height: 1rpx;
                width: 120%;
                background-color: rgba(62, 67, 77, 1);
            }

            &:first-child::before {
                top: 0;
            }

            &::after {
                bottom: 0;
            }

            &:active {
                background: rgba(37, 43, 54, 1);
            }
        }
    }
</style>
