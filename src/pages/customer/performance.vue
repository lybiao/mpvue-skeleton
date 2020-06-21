<template>
    <base-page>
        <template slot="header">
            <base-header :title="date + '业绩'"></base-header>
        </template>
        <template slot="main">
            <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                <div class="top">
                    <p class="money">{{ args.item && args.item.wealth }}</p>
                    <p class="prompt" v-if="args.role=='经理'">该业绩由以下客户消费组成</p>
                    <p class="prompt" v-else>该业绩由以下成员业绩组成</p>
                </div>
                <ul class="itembox">
                    <li class="item" v-for="(item,index) in list" :key="index">
                        <p class="name">{{ item.name }}</p>
                        <p class="num">{{ item.total }}</p>
                    </li>
                </ul>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_PROFIT_DAYDETAIL } from '@/api'


export default {
    data() {
        return {
            date: '',
            args: {},
            nomore: false,
            pageIndex: 1,
            list: []
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        if (options.item) {
            options.item = JSON.parse(options.item)
        }
        this.args = Object.assign(this.args, options)
        console.log(this.args.role)
        if (this.args.item) {
            this.date = `${this.args.item.date.split('-')[1]}月${this.args.item.date.split('-')[2]}日`
        }
        this.getData()
    },
    methods: {
        getData() {
            if (this.nomore || this.isFetching) return
            let params = {
                page: this.pageIndex,
                size: 10,
                id: this.args.id
            }
            if (this.args.item && this.args.item.date) params.date = this.args.item.date
            this.isFetching = true
            this.$http.post(API_ADMIN_PROFIT_DAYDETAIL, params).then(d => {
                this.isFetching = false
                if (d.detail.length != 10) this.nomore = true
                this.list = [...this.list, ...d.detail]
                this.pageIndex++
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .top {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        line-height: 1;
        border-bottom: 1rpx solid #3E434D;
        margin-left: 34rpx;
        padding-bottom: 49rpx;
    }

    .top .money {
        font-size: 52rpx;
        line-height: 66rpx;
        color: #F46387;
        font-weight: 700;
        margin: 43rpx 0 29rpx;
    }

    .top .prompt {
        font-size: 24rpx;
        line-height: 34rpx;
        color: #7A8290;
    }

    .itembox {
        padding-left: 34rpx;
    }

    .itembox .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 31rpx;
        color: #fff;
        font-size: 30rpx;
        height: 138rpx;
        border-bottom: 1rpx solid #3E434D;
    }
</style>
