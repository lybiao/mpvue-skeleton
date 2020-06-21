<template>
    <base-page>
        <template slot="header">
            <base-header></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="top">
                    <div class="avatar" v-if="detail.shortname">{{ detail.shortname }}</div>
                    <div class="name">{{ detail.name }}</div>
                    <div class="vip" v-if="detail.roleenum!=='准客户'">VIP会员</div>
                    <div class="call" @click.stop="callPhone"><i class="icon-298"></i>打电话</div>
                </div>
                <div class="info">
                    <dl>
                        <dt>会员卡余额</dt>
                        <dd class="overage">{{ detail.wealth }}</dd>
                    </dl>
                    <dl>
                        <dt>消费次数</dt>
                        <dd class="frequency">{{ detail.consume_count }}</dd>
                    </dl>
                    <dl>
                        <dt>消费累计</dt>
                        <dd class="total">{{ detail.consume_wealth }}</dd>
                    </dl>
                </div>
                <ul class="botom">
                    <li>
                        <span>手机号码</span>
                        <span>{{ detail.phone }}</span>
                    </li>
                    <li v-if="detail.change_time">
                        <span>办卡时间</span>
                        <span>{{ detail.change_time }}</span>
                    </li>
                    <li v-if="detail.last_consume_time">
                        <span>最近消费</span>
                        <span>{{ detail.last_consume_time }}</span>
                    </li>
                </ul>
                <div class="tip-box">
                    <div class="button recharge" @click.stop="toConsume('会员充值')">会员卡充值</div>
                    <div class="button deduction" @click.stop="toConsume('消费扣款')">消费扣款</div>
                    <div class="button" @click.stop="toBill">账单明细</div>
                </div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { API_ACCOUNT_INFOID } from '@/api'


export default {
    components: {},
    data() {
        return {
            isFetching: false,
            detail: {},
            info: {},
            args: {}
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.getData()
    },
    methods: {
        callPhone() {
            mpvue.makePhoneCall({
                phoneNumber: this.detail.phone
            })
        },
        getData() {
            if (this.isFetching) return
            this.isFetching = true
            this.$http.post(API_ACCOUNT_INFOID, { id: this.args.id }).then(data => {
                this.detail = data.info
                if (data.info.name) {
                    this.detail.shortname = data.info.name.slice(0, 1)
                }
                if (data.info.change_time) {
                    this.detail.change_time = this.$formatTime(data.info.change_time, 'yyyy-MM-dd')
                }
                if (data.info.last_consume_time) {
                    this.detail.last_consume_time = this.$formatTime(data.info.last_consume_time, 'yyyy-MM-dd HH:mm:ss')
                }
                this.isFetching = false
            }).catch((erro) => {
                this.isFetching = false
                this.$toast(erro)
            })
        },
        toBill() {
            this.$navigate({
                url: '/pages/checkout/bill-detail',
                query: {
                    id: this.args.id
                }
            })
        },
        toConsume(text) {
            this.$navigate({
                url: '/pages/checkout/consume',
                query: {
                    info: this.detail,
                    title: text
                }
            })
        }
    }
}
</script>
<style lang="less" type="text/less" scoped>
    .info {
        display: flex;
        margin: 80rpx 0 0 29rpx;
        border-top: 1rpx solid #3e434d;
        padding: 48rpx 0 53rpx 12rpx;
        align-items: center;
        justify-content: flex-start;
    }

    .info dl {
        text-align: center;
        flex: 1;
    }

    .info dl dt {
        font-size: 24rpx;
        color: #fff;
        line-height: 34rpx;
        margin-bottom: 12rpx;
    }

    .info dl > dd {
        font-size: 42rpx;
        line-height: 52rpx;
    }

    .info .overage {
        color: #F46387;
    }

    .info .frequency {
        color: #FF7600;
    }

    .info .total {
        color: #2CC9E9;
    }

    .tip-box {
        margin-top: 80rpx;
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

    .recharge {
        background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
    }

    .deduction {
        background: linear-gradient(135deg, rgba(45, 201, 235, 1) 0%, rgba(20, 210, 184, 1) 100%);
    }

    .top {
        .avatar {
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
            background: linear-gradient(180deg, rgba(61, 73, 93, 1) 0%, rgba(33, 41, 56, 1) 100%);
            font-size: 80rpx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .name {
            height: 76rpx;
            font-size: 60rpx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 84rpx;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-top: 18rpx;
        }

        .vip {
            height: 34rpx;
            font-size: 28rpx;
            font-weight: 400;
            color: rgba(235, 131, 211, 1);
            line-height: 40rpx;
            text-align: center;
            padding-top: 15rpx;

            &.wait {
                color: rgba(6, 255, 243, 1);
            }
        }

        .call {
            width: 242rpx;
            height: 87rpx;
            background: rgba(37, 43, 54, 1);
            border-radius: 51rpx;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 60rpx auto 0;
            font-size: 26rpx;
            font-weight: 500;
            color: rgba(187, 194, 210, 1);

            .icon-298 {
                font-size: 32rpx;
                color: #3c6;
                padding-right: 10rpx;
            }
        }
    }

    .botom {
        margin-left: 29rpx;
        border-top: 1rpx solid rgba(62, 67, 77, 1);

        li {
            height: 60rpx;
            line-height: 60rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 42rpx;

            &:first-child {
                margin-top: 40rpx;
            }
        }
        span:first-child {
            padding-right: 46rpx;
        }
    }
</style>
