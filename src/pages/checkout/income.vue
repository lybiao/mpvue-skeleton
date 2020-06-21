<template>
    <base-page>
        <template slot="header">
            <base-header :title="title"></base-header>
        </template>
        <template slot="main">
            <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                <div class="income">
                    <p class="mtitle">总金额</p>
                    <p class="money">￥{{ amount }}</p>

                    <div class="nav">
                        <p v-for="(item, index) in nav" :class="{active:curIndex==index}" @click="changeNav(index)" :key="index">{{ item }}</p>
                    </div>
                    <div class="list">
                        <div class="item" v-for="item in list" :key="item.create_time">
                            <div class="user">
                                <p>{{ item.name }}<em>外交官：{{ item.ref_name }}</em></p>
                            </div>
                            <div class="info">{{ item.money }}元<em>{{ item.create_time }}</em></div>
                        </div>
                        <p class="noinfor" v-if="list.length == 0">暂无数据</p>
                    </div>
                </div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { API_CHECKSTAND_LIST } from '@/api';
const MAX_SIZE = 20;


export default {
    data() {
        return {
            args: {},
            amount: 0,
            curIndex: 0,
            pageIndex: 1,
            nav: ['今日', '昨日', '全部'],
            list: [],
            isFetching: false
        };
    },
    computed: {
        title() {
            return `${this.nav[this.curIndex]}${this.args.type}`;
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.getData();
    },
    methods: {
        getData() {
            if (this.isFetching || this.nomore) return;
            this.isFetching = true;
            this.$http.post(API_CHECKSTAND_LIST, { page: this.pageIndex, size: MAX_SIZE, day_type: 2 - this.curIndex, stat_type: this.args.type == '营业额' ? 0 : 1 }).then(data => {
                this.amount = data.amount;
                data.list.forEach(item => {
                    item.create_time = this.$formatTime(item.create_time, 'yyyy/MM/dd HH:mm:ss');
                });
                this.list = this.list.concat(data.list);
                this.pageIndex++;
                this.isFetching = false;
                if (data.list.length < MAX_SIZE) this.nomore = true;
            });
        },
        changeNav(index) {
            if (this.curIndex == index || this.isFetching) return;
            this.curIndex = index;
            this.isFetching = false;
            this.nomore = false;
            this.pageIndex = 1;
            this.list = [];
            this.getData();
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .nav {
        display: flex;
        justify-content: space-around;
        font-size: 28rpx;
        padding-top: 20rpx;
        margin: 100rpx 0 20rpx;
        line-height: 3;
        box-shadow: 0 -20rpx 30rpx rgba(0, 0, 0, 0.3);
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
        bottom: 10rpx;
        height: 5rpx;
        background: rgba(255, 93, 93, 1);
        border-radius: 3rpx;
    }

    .income {
        color: #fff;
    }

    .income .mtitle {
        text-align: center;
        padding-top: 100rpx;
        font-size: 29rpx;
    }

    .income .money {
        font-size: 64rpx;
        color: #FF5D5D;
        font-weight: bold;
        text-align: center;
    }

    .income .list {
        padding: 0 30rpx 50rpx;
    }

    .income .list .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 26rpx;
        padding: 30rpx 0;
        position: relative;
        color: #ccc;
    }

    .income .list .item:after {
        content: "";
        position: absolute;
        left: 0;
        right: -40rpx;
        bottom: 0;
        height: 1rpx;
        background-color: #3E434D;
    }

    .income .list .item .img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 100%;
        margin-right: 20rpx;
    }

    .income .list .item .img:after {
        background-color: rgba(255, 255, 255, 0.05);
    }

    .income .list .item .user {
        display: flex;
        align-items: center;
    }

    .income .list .item .info {
        text-align: right;
        font-size: 29rpx;
    }

    .income .list .item .info em, .income .list .item .user em {
        display: block;
        font-size: 20rpx;
        color: #747C8D
    }

    .income .list .item:last-child:after {
        content: none;
    }
</style>
