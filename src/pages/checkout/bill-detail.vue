<template>
    <base-page>
        <template slot="header">
            <base-header title="账单明细"></base-header>
        </template>
        <template slot="main">
            <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                <ul class="itembox">
                    <li class="item" v-for="(item,index) in dataList" :key="index">
                        <div class="info">
                            <p class="title">{{ item.remark }}</p>
                            <p class="time">{{ item.create_time }}</p>
                        </div>
                        <div class="money">
                            <p class="title" :class="{add:item.offset_wealth>0}">{{ item.offset_wealth }}</p>
                            <p class="time">余额: {{ item.wealth }}</p>
                        </div>
                    </li>
                </ul>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { API_ACCOUNT_LOGSAM } from '@/api';
import { PageMixin } from '@/mixins';
const MAX_SIZE = 20;


export default {
    mixins: [PageMixin],
    data() {
        return {
            args: {},
            pageIndex: 1,
            nomore: false,
            dataList: [],
            isFetching: false,
        };
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.getData();
    },
    methods: {
        getData() {
            if (this.nomore || this.isFetching) return;
            let params = {
                id: this.args.id,
                page: this.pageIndex,
                size: MAX_SIZE
            };
            this.isFetching = true;
            this.$http.post(API_ACCOUNT_LOGSAM, params).then(d => {
                this.isFetching = false;
                if (d.info.length < MAX_SIZE) this.nomore = true;
                d.info.forEach(item => {
                    item.create_time = this.$formatTime(item.create_time, 'yyyy/MM/dd HH:mm');
                });
                this.dataList = [...this.dataList, ...d.info];
                this.pageIndex++;
            }).catch(() => {
                this.isFetching = false;
            });
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .itembox {
        padding-left: 34rpx;
    }

    .itembox .item {
        height: 138rpx;
        display: flex;
        justify-content: space-between;
        color: #fff;
        border-bottom: 1rpx solid #3E434D;
        align-items: center;
        padding-right: 34rpx;
    }

    .itembox .item .title {
        font-size: 30rpx;
        line-height: 42rpx;
    }

    .itembox .item .time {
        font-size: 24rpx;
        line-height: 32rpx;
        color: #97A0B4;
    }

    .itembox .item .money .title {
        text-align: right;
    }

    .itembox .item .money .title.add {
        color: #F46387;
    }
</style>
