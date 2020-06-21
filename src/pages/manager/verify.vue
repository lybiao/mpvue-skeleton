<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true" title="订单详情"></base-header>
        </template>
        <template slot="main">
            <div class="nav">
                <p v-for="(item, index) in nav" :key="index" :class="{active:curIndex==index}" @click="changeNav(index)">{{ item }}</p>
            </div>
            <scroll-view class="scroll-view" :scroll-y="true" @scrolltolower="getData">
                <div class="booking">
                    <div class="item" :class="'state' + item.state" v-for="(item, index) in list" :key="index">
                        <p>预定包房：{{ item.room_name }}</p>
                        <p>预定时间：{{ item.date }}</p>
                        <div class="info">
                            <div class="user">
                                <i class="img imgsd bgauto" :style="{backgroundImage: 'url('+item.img_face+')'}"></i>
                                {{ item.name }}
                            </div>
                            <div class="btn" v-if="item.state == 0" @click="passItem(item, index)">确认订单</div>
                            <span v-else-if="item.state == 1">订单已确认</span>
                            <span v-else>订单已结束</span>
                        </div>
                    </div>
                </div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_CHECKIN_COMFIRM, API_CHECKIN_LIST } from '@/api'


export default {
    mixins: [PageMixin],
    data() {
        return {
            list: [],
            args: {},
            nav: ['全部', '待确认', '已确认'],
            state: ['待确认', '预定成功', '已结束'],
            curIndex: 0,
            pageIndex: 1,
            nomore: false
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.getData()
    },
    methods: {
        getData() {
            if (this.nomore || this.isFetching) return
            this.isFetching = true
            this.$http.post(API_CHECKIN_LIST, { type: this.curIndex, page: this.pageIndex, size: 20 }).then(data => {
                this.isFetching = false
                if (data.list) {
                    this.list = this.list.concat(data.list)
                    if (data.list.length < 20) this.nomore = true
                }
                this.list.forEach(item => {
                    item.date = this.$formatTime(item.date, 'yyyy-MM-dd')
                })
                this.pageIndex++
            }).catch(erro => {
                this.isFetching = false
                this.$toast(erro)
            })
        },
        passItem(item, index) {
            mpvue.showModal({
                content: '请再次确认是否确认该订单？',
                success(res) {
                    if (res.confirm) {
                        this.$http.post(API_CHECKIN_COMFIRM, { id: item.id }).then(data => {
                            if (this.curIndex == 0) {
                                item.state = 1
                            } else {
                                this.list.splice(index, 1)
                            }
                        }).catch((error) => {
                            this.$toast(error)
                        })
                    }
                }
            })
        },
        changeNav(index) {
            if (this.isFetching) return
            this.curIndex = index
            this.pageIndex = 1
            this.list = []
            this.nomore = false
            this.getData()
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .nav {
        display: flex;
        justify-content: space-around;
    }

    .nav p {
        color: #fff;
    }

    .nav p.active {
        color: #FF5D5D;
        position: relative;
    }

    .nav p.active:after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        bottom: -14rpx;
        height: 5rpx;
        background: rgba(255, 93, 93, 1);
        border-radius: 3rpx;
    }

    .booking {
        padding: 50rpx 0;
    }

    .booking .btn {
        width: 142rpx;
        height: 44rpx;
        line-height: 44rpx;
        text-align: center;
        background: #252b36;
        border-radius: 22rpx;
        color: #fff;
        font-size: 20rpx;
    }

    .booking .item {
        margin: 24rpx 27rpx 0;
        height: 247rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 20rpx;
        position: relative;
        color: #fff;
    }

    .booking .item p {
        margin-left: 26rpx;
        font-size: 26rpx;
    }

    .booking .item p:first-child {
        padding: 22rpx 26rpx 0 0;
        display: flex;
        justify-content: space-between;
    }

    .booking .item.state1 .info {
        color: #F66E62;
    }

    .booking .item.state2 {
        color: #5F6671;
    }

    .booking .info {
        display: flex;
        justify-content: space-between;
        padding: 0 26rpx;
        align-items: center;
        font-size: 20rpx;
        margin-top: 70rpx;
        height: 44rpx;
    }

    .booking .info .user {
        color: #fff;
    }

    .booking .info .img {
        width: 30rpx;
        height: 30rpx;
        border-radius: 15rpx;
        display: inline-block;
        vertical-align: middle;
    }
</style>
