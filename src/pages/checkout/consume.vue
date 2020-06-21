<template>
    <base-page>
        <template slot="header">
            <base-header :title="args.title"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scrollbox scroll-view" :scroll-y="true">
                <div class="info">
                    <p class="phone" v-if="args.info.phone">{{ args.info.phone }}</p>
                    <p class="name">{{ args.info.name }}</p>
                    <p class="money">余额: {{ args.info.wealth }}</p>
                </div>
                <div class="enter-box">
                    <p class="title">{{ text }}金额</p>
                    <div class="enter-input" :class="{'enter-color':args.title==='会员充值'}">￥{{ money }}</div>
                </div>
            </scroll-view>
        </template>
        <template slot="export">
            <KeyBoard @checkNum="checkNum" :color="color" @confirm="confirm" :text="text" @removeNum="removeNum" />
        </template>
    </base-page>
</template>

<script>
import { API_ACCOUNT_OFFSET } from '@/api';
import KeyBoard from '@/pages/components/keyboard';
import { PageMixin } from '@/mixins';


export default {
    mixins: [PageMixin],
    components: {
        KeyBoard
    },
    data() {
        return {
            color: 0,
            args: {},
            money: '',
            text: ''
        };
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        if (options.info) {
            options.info = JSON.parse(options.info);
        }
        this.args = Object.assign(this.args, options);
        this.text = this.args.title === '会员充值' ? '充值' : '扣款';
    },
    methods: {
        getData(type) {
            this.$showLoading({
                title: '进行中',
                mask: true
            });
            this.$http.post(API_ACCOUNT_OFFSET, { wealth: +this.money, phone: this.args.info.phone, type: type }).then(d => {
                this.$bus.emit('update:checkout/counter');
                this.$navigate({
                    url: '/pages/checkout/success',
                    query: {
                        info: d.log,
                        title: this.args.title
                    }
                });
                this.$hideLoading();
            }).catch((error) => {
                if (error.includes('失败') || error.includes('too large')) error = '余额不足';
                this.$toast(error);
                this.$hideLoading();
            });
        },
        checkNum(data) {
            if (data) {
                this.color = this.text === '充值' ? 1 : 2;
            } else {
                this.color = 0;
            }
            if (this.money.length >= 9) return false;
            this.money += data;
        },
        removeNum() {
            if (this.money.length > 1) {
                this.money = this.money.substring(0, this.money.length - 1);
            } else {
                this.money = '';
            }
        },
        confirm() {
            if (this.args.title === '会员充值') {
                this.text = '充值';
                this.getData(1);
            } else {
                this.text = '扣款';
                this.getData(0);
            }
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .scrollbox {
        padding-bottom: 120rpx
    }

    .info {
        margin: 100rpx 0;
        display: flex;
        color: #fff;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-weight: 700;
    }

    .info .phone {
        font-size: 64rpx;
        line-height: 80rpx;
    }

    .info .name {
        font-size: 64rpx;
        line-height: 90rpx;
    }

    .info .money {
        font-size: 36rpx;
        line-height: 50rpx;
        font-weight: normal;
        color: #788195;
    }

    .enter-box {
        padding: 0 43rpx 0 44rpx;
    }

    .enter-box .title {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #fff;
    }

    .enter-box .enter-input {
        font-size: 80rpx;
        color: #27CBDF;
        border-bottom: 1rpx solid #979797;
    }

    .enter-box .enter-input.enter-color {
        color: #F46387;
    }


</style>
