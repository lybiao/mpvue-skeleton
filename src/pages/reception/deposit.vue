<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true" title="充值"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="deposit">
                    <p class="name">{{ cardData.name }}</p>
                    <p class="phone">{{ cardData.phone }}</p>

                    <p class="mtitle">会员卡号</p>
                    <p class="money" style="color:#2cc9e9;">
                        NO.
                        <input type="number" maxlength="6" v-model="card_no">
                    </p>

                    <p class="mtitle">充值金额</p>
                    <p class="money" @click="setMoney">￥{{ money }}</p>
                </div>
            </scroll-view>
        </template>
        <template slot="export">
            <Keyboard color="1" text="充值" @checkNum="checkNum" @removeNum="removeNum" @confirm="confirm" v-if="showKeyboard" :is-login="true" />
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ACCOUNT_OFFSET } from '@/api'
import Keyboard from '@/pages/components/keyboard'


export default {
    mixins: [PageMixin],
    components: {
        Keyboard
    },
    data() {
        return {
            money: '',
            showKeyboard: false,
            card_no: '',
            cardData: {
                money: 0,
                name: '',
                phone: ''
            }
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.cardData = Object.assign(JSON.parse(options.custom))
    },
    onUnload() {
        this.$bus.off('deposit-success')
    },
    methods: {
        setMoney() {
            this.showKeyboard = true
        },
        checkNum(number) {
            if ((!this.money && number == '0') || this.money.length > 10 || this.wrongtxt) return
            if (number == '.' && this.money.includes('.')) return
            this.money += number
        },
        removeNum() {
            if (this.money) {
                this.money = this.money.slice(0, this.money.length - 1)
            }
        },
        confirm() {
            if (this.money < 5000) return this.$toast('最低充值5000元')
            this.$showLoading('充值中')

            this.$http.post(API_ACCOUNT_OFFSET, { wealth: this.money, phone: this.cardData.phone, type: 3, card_no: this.card_no }).then(data => {
                this.$hideLoading()
                let item = {
                    type: '充值成功',
                    money: this.money
                }
                this.$bus.emit('deposit-success', item)
                this.back()
            }).catch(error => {
                this.$hideLoading()
                this.$toast(error)
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .deposit {
        text-align: center;
        color: #fff;
    }

    .deposit .name {
        font-size: 74rpx;
        line-height: 104rpx;
        font-weight: bold;
        padding-top: 50rpx;
    }

    .deposit .phone {
        font-size: 38rpx;
        line-height: 52rpx;
        color: #97a0b4;
        font-weight: bold;
    }

    .deposit .mtitle {
        margin-top: 120rpx;
        text-align: left;
        margin-left: 60rpx;
        font-size: 28rpx;
    }

    .deposit .money {
        border-bottom: 1rpx solid #97a0b4;
        margin: 0 60rpx;
        text-align: left;
        color: #f46387;
        font-size: 80rpx;
        font-weight: bold;
        text-indent: -10rpx;
        display: flex;
        align-items: center;
        padding: 20rpx 0;
    }

    .deposit .money input {
        width: 70%;
        background-color: transparent;
        font-weight: bold;
        color: #2cc9e9;
        text-indent: 10rpx;
        height: 60%;
        margin-left: 30rpx;
    }
</style>
