<template>
    <base-page>
        <template slot="header">
            <base-header @left="toExit" left-type="exit" :custom-return="true" title="前台" title-class="zero"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true" @scrolltolower="getData">
                <div class="maindata">
                    <div class="item">
                        <p>今日开卡数</p>
                        <em>{{ info.today }}</em>
                    </div>
                    <div class="item">
                        <p>昨日开卡数</p>
                        <em>{{ info.yesterday }}</em>
                    </div>
                    <div class="item">
                        <p>本周开卡数</p>
                        <em>{{ info.week }}</em>
                    </div>
                </div>

                <div class="btn" @click="toActivation">激活会员卡</div>

                <dl class="list">
                    <dt>开卡记录</dt>
                    <dd v-for="(item,index) in list" :key="index" @click="toCustomerDetail(item)">
                        <em>{{ item.name }}</em>
                        <i>首充：{{ item.first_payin }}</i>
                        <i>{{ item.time }}</i>
                    </dd>
                    <p class="noinfor" v-if="!list.length">暂时没有开卡记录</p>
                </dl>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_RECEPTION, API_RECEPTION_LIST } from '@/api'
import { mapGetters } from 'vuex'
const MAX_SIZE = 20;


export default {
    mixins: [PageMixin],
    data() {
        return {
            info: {
                today: 1,
                week: 2,
                yesterday: 1
            },
            pageIndex: 1,
            list: [],
            nomore: false,
            flag: false
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.getData()
    },
    onUnload() {
        this.$bus.off('update:reception/reception')
    },
    methods: {
        getData() {
            this.$http.post(API_RECEPTION).then(data => {
                this.info = data.info
                this.nomore = false
                this.getListData()
            }).catch(error => {
                this.$toast(error)
            })
        },
        getListData() {
            if (this.nomore || this.flag) return
            this.flag = true
            this.$http.post(API_RECEPTION_LIST, { page: this.pageIndex, size: MAX_SIZE }).then(data => {
                if (this.pageIndex === 1) {
                    this.list = data.list
                } else {
                    this.list = this.list.concat(data.list)
                }
                this.pageIndex++
                this.list.forEach(item => {
                    item.time = this.$formatTime(item.time, 'MM-dd HH:mm')
                })
                this.flag = false
                if (data.list.length < MAX_SIZE) this.nomore = true
            }).catch(error => {
                this.flag = false
                this.$toast(error)
            })
        },
        toActivation() {
            this.$bus.on('update:reception/reception', () => {
                this.pageIndex = 1
                this.flag = false
                this.getData()
            })

            this.$navigate({
                url: '/pages/reception/activation'
            })
        },
        toExit() {
            this.$navigate({
                url: '/pages/user/exit'
            })
        },
        toCustomerDetail(item) {
            this.$navigate({
                url: '/pages/customer/detail',
                query: {
                    id: item.id
                }
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .maindata {
        display: flex;
        padding-top: 66rpx;
        color: #fff;
        font-size: 24rpx;
    }

    .maindata .item {
        flex: 1;
        text-align: center;
    }

    .maindata .item em {
        font-size: 42rpx;
        line-height: 52rpx;
        margin-top: 15rpx;
        font-weight: bold;
        color: #f46387;
    }

    .maindata .item:nth-child(2) em {
        color: #9f71ff;
    }

    .maindata .item:nth-child(3) em {
        color: #2cc9e9;
    }

    .btn {
        width: 562rpx;
        height: 100rpx;
        background:  #252b36;
        border-radius: 50rpx;
        color: #fff;
        text-align: center;
        margin: 116rpx auto;
        font-size: 27rpx;
        line-height: 100rpx;
        font-weight: bold;
    }

    .list {
        margin-left: 34rpx;
        color: #fff;
        font-size: 20rpx;
    }

    .list dt {
        font-size: 26rpx;
        margin-bottom: 20rpx;
    }

    .list dd {
        border-top: 1rpx solid #3e434d;
        padding: 38rpx 0;
        display: flex;
        align-items: center;
    }

    .list dd em {
        font-size: 30rpx;
        width: 180rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .list dd i {
        flex: 1;
        font-size: 24rpx;
        color: #f46387;
    }

    .list dd i:last-child {
        color: #97a0b4;
        text-align: right;
    }

    .list dd:after {
        content: "\e900";
        font-family: icomoon !important;
        font-size: 24rpx;
        color: #97a0b4;
        line-height: 1;
        margin: 0 25rpx;
    }

    .list .noinfor {
        border-top: 1rpx solid #3e434d;
        padding-top: 200rpx;
        font-size: 30px;
        line-height: 42px;
    }
</style>
