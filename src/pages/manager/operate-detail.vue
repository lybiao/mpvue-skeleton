<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="freeze" v-if="isFreeze">
                    <i class="icon-169"></i>
                    <span>账号已冻结</span>
                </div>
                <div class="top">
                    <div class="avatar">{{ imgName }}</div>
                    <div class="name">{{ detail.name }}</div>
                    <div class="vip" v-if="detail.roleenum != '准客户'">VIP会员</div>
                    <div class="call" @click.stop="callPhone">
                        <i class="icon-298"></i>打电话
                    </div>
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
                        <p>手机号码</p>
                        <em>{{ detail.phone }}</em>
                    </li>
                    <li>
                        <p>办卡时间</p>
                        <em>{{ detail.change_time }}</em>
                    </li>
                    <li>
                        <p>最近消费</p>
                        <em v-if="detail.last_consume_time">{{ detail.last_consume_time }}</em>
                        <em v-else>无</em>
                    </li>
                </ul>
                <div class="button" @click.stop="toBill">账单明细</div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ACCOUNT_INFOID } from '@/api'


export default {
    mixins: [PageMixin],
    data() {
        return {
            isFetching: false,
            detail: {},
            isFreeze: false,
            args: {},
            imgName: ''
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
                this.isFetching = false
                this.detail = data.info
                this.imgName = this.detail.name.substring(0, 1)
                this.detail.change_time = this.$formatTime(this.detail.change_time, 'yyyy-MM-dd')
                this.detail.last_consume_time = this.$formatTime(this.detail.last_consume_time, 'yyyy-MM-dd HH:mm:ss')
            }).catch(erro => {
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
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .info {
        display: flex;
        margin: 80rpx 0 0 29rpx;
        border-top: 1rpx solid #3e434d;
        padding: 56rpx 0 53rpx 12rpx;
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
        color: #f46387;
    }

    .info .frequency {
        color: #ff7600;
    }

    .info .total {
        color: #2cc9e9;
    }


    .freeze {
        width: 218rpx;
        height: 58rpx;
        background: rgba(255, 45, 85, 1);
        border-radius: 29rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin: 0 auto 68rpx;
        font-size: 24rpx;
        .icon-169 {
            margin-right: 10rpx;
        }
    }

    .top {
        .avatar {
            width: 160rpx;
            height: 160rpx;
            border-radius: 50%;
            background:  #252b36;
            font-size: 80rpx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
        }

        .name {
            height: 80rpx;
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
            width: 256rpx;
            height: 92rpx;
            background: rgba(37, 43, 54, 1);
            border-radius: 54rpx;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 60rpx auto 0;
            font-size: 28rpx;
            font-weight: 500;
            color: rgba(187, 194, 210, 1);

            .icon-298 {
                font-size: 30rpx;
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
            p {
                width: 100rpx;
                display: inline-block;
                margin-right: 46rpx;
                color: #97a0b4;
            }
        }
    }

    .button {
        width: 626rpx;
        height: 96rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 50rpx;
        line-height: 96rpx;
        margin: 0 auto;
        border: none;
        margin-top: 164rpx;
        color: #fff;
        font-size: 30rpx;
    }
</style>


