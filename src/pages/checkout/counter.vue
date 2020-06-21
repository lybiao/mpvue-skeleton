<template>
    <base-page>
        <template slot="header">
            <base-header title="收银台" @left="toExit" left-type="exit" :custom-return="true"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <p class="title">财务经营数据</p>
                <div class="info">
                    <dl>
                        <dt>今日</dt>
                        <dd @click.stop="toIncome('营业额')">
                            今日营业额
                            <p class="today">{{ detail.today_pay }}</p>
                        </dd>
                        <dd @click.stop="toIncome('充值')">
                            今日充值
                            <p class="yesterday">{{ detail.today_payin }}</p>
                        </dd>
                        <dd>
                            今日会员数
                            <p class="total">{{ detail.today_user }}</p>
                        </dd>
                    </dl>
                    <dl>
                        <dt>昨日</dt>
                        <dd @click.stop="toIncome('营业额')">
                            昨日营业额
                            <p class="today">{{ detail.yesterday_pay }}</p>
                        </dd>
                        <dd @click.stop="toIncome('充值')">
                            昨日充值
                            <p class="yesterday">{{ detail.yesterday_payin }}</p>
                        </dd>
                        <dd>
                            昨日会员数
                            <p class="total">{{ detail.yesterday_user }}</p>
                        </dd>
                    </dl>
                    <dl>
                        <dt>累计</dt>
                        <dd @click.stop="toIncome('营业额')">
                            营业额总计
                            <p class="today">{{ detail.total_pay }}</p>
                        </dd>
                        <dd @click.stop="toIncome('充值')">
                            充值总计
                            <p class="yesterday">{{ detail.total_payin }}</p>
                        </dd>
                        <dd>
                            会员总计
                            <p class="total">{{ detail.total_user }}</p>
                        </dd>
                    </dl>
                </div>
                <div class="button" @click.stop="toSearch">
                    <i class="icon-40"></i>
                </div>
                <div class="button recharge" @click.stop="toPhone('会员充值')">会员充值</div>
                <div class="button deduction" @click.stop="toPhone('消费扣款')">消费扣款</div>
            </scroll-view>
        </template>
        <template slot="export">
            <div class="city_search" :class="{active: isShowAnimate}" v-if="isSearch">
                <CheckoutSearch @hide="cancel" />
            </div>
        </template>
    </base-page>
</template>

<script>
import { API_CHECKSTAND_STAT } from '@/api';
import CheckoutSearch from '@/pages/components/search';


export default {
    components: {
        CheckoutSearch
    },
    data() {
        return {
            isSearch: false,
            args: {},
            isShowAnimate: false,
            detail: {
                total_pay: 0,
                total_payin: 0
            }
        };
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.getStateData();

        this.$bus.on('update:checkout/counter', () => {
            this.getStateData();
        });
    },
    onUnload() {
        this.$bus.off('update:checkout/counter');
    },
    methods: {
        resetMoney(num) {
            if (!num) return 0;
            num = Math.floor(num);
            let numStr = num.toString();
            if (numStr.length < 5) {
                return numStr;
            } else if (numStr.length >= 5 && numStr.length <= 8) {
                let decimal = numStr.substring(numStr.length - 4, numStr.length - 3);
                return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
            } else if (numStr.length > 8) {
                let decimal = numStr.substring(numStr.length - 8, numStr.length - 7);
                return parseFloat(parseInt(num / 100000000) + '.' + decimal) + '亿';
            }
        },
        getStateData() {
            this.$http.post(API_CHECKSTAND_STAT).then(d => {
                this.detail = d.stat;
                let props = ['today_pay', 'today_payin', 'today_user', 'yesterday_pay', 'yesterday_user', 'total_pay', 'total_payin', 'total_user'];
                Object.keys(this.detail).forEach(prop => {
                    if (props.includes(prop)) {
                        this.detail[prop] = this.resetMoney(this.detail[prop]);
                    }
                });
            });
        },
        toPhone(text) {
            this.$navigate({
                url: '/pages/checkout/phone',
                query: {
                    title: text
                }
            });
        },
        toSearch() {
            this.isSearch = true;
            setTimeout(() => {
                this.isShowAnimate = true;
            }, 100);
        },
        cancel() {
            this.isShowAnimate = false;
            setTimeout(() => {
                this.isSearch = false;
            }, 300);
        },
        toExit() {
            this.$navigate({
                url: '/pages/user/exit'
            });
        },
        toIncome(type) {
            this.$navigate({
                url: '/pages/checkout/income',
                query: {
                    type: type
                }
            });
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .title {
        font-size: 28rpx;
        line-height: 40rpx;
        color: #6F727D;
        text-align: center;
    }

    .info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #fff;
        padding: 135rpx 60rpx 140rpx 43rpx;
    }

    .info dl dt {
        font-size: 36rpx;
        line-height: 50rpx;
        margin-bottom: 53rpx;
        font-weight: 600;
        text-align: center;
    }

    .info dl dd {
        font-size: 24rpx;
        line-height: 34rpx;
        text-align: center;
    }

    .info dl dd p {
        font-size: 46rpx;
        font-weight: 700;
        text-align: center;
        margin: 20rpx 0 85rpx;
    }

    .info .today {
        color: #F46387;
    }

    .info .yesterday {
        color: #9F71FF;
    }

    .info .total {
        color: #2CC9E9;
    }

    .button {
        width: 610rpx;
        height: 100rpx;
        line-height: 100rpx;
        border-radius: 50rpx;
        background-color: #252B36;
        color: #fff;
        margin: 0 auto 32rpx;
        border: none;
        font-size: 32rpx;
        overflow: hidden;
    }

    .button .icon-40 {
        font-size: 34rpx;
        color: #8D93A1;
        vertical-align: middle;
    }

    .recharge {
        background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
    }

    .deduction {
        background: linear-gradient(135deg, rgba(45, 201, 235, 1) 0%, rgba(20, 210, 184, 1) 100%);
    }
</style>


<style lang="stylus" scoped>
    .city_search
        position fixed
        top 0
        left 0
        bottom 0
        right 0
        transform translateY(100%)
        transition transform 0.3s
        z-index 9999
        &.active
            transform translateY(0)
</style>
