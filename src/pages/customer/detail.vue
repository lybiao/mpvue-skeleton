<template>
    <base-page>
        <template slot="header">
            <base-header></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true" @scrolltolower="getcusDetail">
                <div class="top">
                    <p class="name">{{ cardData.name }}</p>
                    <p class="infor" v-if="hasName && cardData.refname">{{ roles[cardData.refrole] }}：{{ cardData.refname }}</p>

                    <p class="vip" v-if="cardData.card_no">VIP会员</p>
                    <p class="vip wait" v-else>待激活</p>

                    <div class="call" @click.stop="callPhone"><i class="icon-298"></i>打电话</div>
                </div>
                <ul class="botom">
                    <li>
                        <span>手机号码</span>
                        <span>{{ cardData.phone }}</span>
                    </li>
                    <li>
                        <span>办卡时间</span>
                        <span>{{ cardData.create_time }}</span>
                    </li>
                    <li>
                        <span>最近消费</span>
                        <span>{{ cardData.last_consume_time }}</span>
                    </li>
                </ul>
            </scroll-view>
        </template>
        <template slot="footer">
            <div class="btn" @click="toDeposit" v-if="!cardData.card_no && showCard">立即充值激活</div>
        </template>
    </base-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { API_ADMIN_MYCYS_DETAIL } from '@/api'


export default {
    data() {
        return {
            args: {},
            roles: ['', '管理员', '部长', '总监', '经理'],
            cardData: {
                money: 0,
                name: '',
                cardno: 888888,
                phone: 0,
                role: 0,
                state: 0,
                change_time: '',
                last_consume_time: ''
            }
        }
    },
    computed: {
        ...mapGetters(['user']),
        hasName() {
            return ['收银台', '管理员', '前台'].includes(this.user.roleenum)
        },
        showCard() {
            return ['前台', '收银台'].includes(this.user.roleenum)
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.getcusDetail()
    },
    onUnload() {
        this.$bus.emit('update:reception/reception')
        this.$bus.off('deposit-success')
    },
    methods: {
        callPhone() {
            mpvue.makePhoneCall({
                phoneNumber: this.cardData.phone
            })
        },
        getcusDetail() {
            this.$http.post(API_ADMIN_MYCYS_DETAIL, { id: this.args.id }).then(res => {
                this.cardData = { ...this.cardData, ...res.info, role: res.info.roleenum, cardno: res.info.card_no }
                this.cardData.state = res.info.roleenum != '准客户'
                this.cardData.cardno = this.cardData.card_no ? this.cardData.card_no : '未激活'

                this.cardData.shortName = this.cardData.name.substr(0, 1)
                this.cardData.create_time = this.cardData.create_time ? this.$formatTime(this.cardData.create_time, 'yyyy-MM-dd HH:mm') : '无'
                this.cardData.last_consume_time = this.cardData.last_consume_time ? this.$formatTime(this.cardData.last_consume_time, 'yyyy-MM-dd HH:mm') : '无'
            }).catch((erro) => {
                this.$toast(erro)
            })
        },
        toDeposit() {
            this.$bus.on('deposit-success', () => {
                this.getcusDetail()
            })

            this.$navigate({
                url: '/pages/reception/deposit',
                query: {
                    custom: this.cardData
                }
            })
        }
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .top {
        text-align: center;
        color: #fff;

        .infor {
            font-size: 31rpx;
            font-weight: bold;
            margin-top: 15rpx;
            color: #788195;
        }

        .name {
            height: 84rpx;
            font-size: 60rpx;
            font-weight: 500;
            line-height: 84rpx;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-top: 18rpx;
        }

        .vip {
            height: 40rpx;
            font-size: 28rpx;
            font-weight: bold;
            line-height: 40rpx;
            text-align: center;
            margin-top: 10rpx;
            color: #EB83D3;

            &.wait {
                color: #06FFF3
            }
        }

        .call {
            width: 284rpx;
            height: 102rpx;
            background: rgba(37, 43, 54, 1);
            border-radius: 52rpx;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 60rpx auto 0;
            font-size: 30rpx;
            font-weight: 500;
            color: rgba(187, 194, 210, 1);

            .icon-298 {
                font-size: 34rpx;
                color: #3c6;
                padding-right: 10rpx;
            }
        }
    }

    .botom {
        margin-left: 29rpx;
        margin-top: 70rpx;
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
            color: #97A0B4
        }
    }

    .cardbox {
        margin-top: 70rpx;
    }

    .btn {
        width: 542rpx;
        height: 100rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 50rpx;
        color: #F65364;
        font-size: 32rpx;
        text-align: center;
        line-height: 100rpx;
        font-weight: bold;
        margin: 0 auto 80rpx;
    }
</style>
