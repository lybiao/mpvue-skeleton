<template>
    <base-page>
        <template slot="header">
            <base-header :title="args.title"></base-header>
        </template>
        <template slot="main">
            <p class="content phone" v-if="phone">{{ phone }}</p>
            <p class="content" v-else>请输入客户手机号</p>
        </template>
        <template slot="export">
            <KeyBoard @checkNum="checkNum" :phone-num="phoneNum" @removeNum="removeNum" />
        </template>
    </base-page>
</template>

<script>
import { API_ACCOUNT_INFO } from '@/api'
import KeyBoard from '@/pages/components/keyboard'


export default {
    components: {
        KeyBoard
    },
    data() {
        return {
            args: {},
            phone: '',
            phoneNum: true
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
    },
    methods: {
        getData(phone) {
            this.$http.post(API_ACCOUNT_INFO, { phone: phone }).then(d => {
                if (d.info.card_no) {
                    this.$navigate({
                        url: '/pages/checkout/consume',
                        query: {
                            info: d.info,
                            title: this.args.title
                        }
                    })
                } else {
                    this.$toast('请先往前台激活')
                }
            }).catch(erro => {
                this.$toast(erro)
            })
        },
        checkNum(data) {
            if(this.phone.length > 11) return false
            this.phone += data
            if (this.phone.length === 11) {
                this.getData(this.phone)
            }
        },
        removeNum() {
            if (this.phone.length > 1) {
                this.phone = this.phone.substring(0, this.phone.length - 1)
            } else {
                this.phone = ''
            }
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .content {
        font-size: 48rpx;
        line-height: 66rpx;
        color: #6F727D;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 435rpx;
        text-align: center;
    }

    .phone {
        font-size: 68rpx;
        line-height: 86rpx;
        color: #fff;
        font-weight: 700;
    }
</style>
