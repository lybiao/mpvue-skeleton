<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true" title="激活会员卡"></base-header>
        </template>
        <template slot="main">
            <div class="activation">
                <div class="input" :class="{active: phoneNumber}" v-if="showPhoneNumber">{{ showPhoneNumber }}</div>
                <div class="input" :class="{active: phoneNumber}" v-else>请输入客户手机号</div>
                <div class="tip">{{ wrongtxt }}</div>
            </div>
        </template>
        <template slot="export">
            <Keyboard @checkNum="checkNum" @removeNum="removeNum" :phone-num="'170rpx'" />
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_RECEPTION_INFO } from '@/api'
import Keyboard from '@/pages/components/keyboard'


export default {
    mixins: [PageMixin],
    components: {
        Keyboard
    },
    data() {
        return {
            phoneNumber: '',
            wrongtxt: ''
        }
    },
    computed: {
        showPhoneNumber() {
            let val = this.phoneNumber
            if (val.length > 3 && val.length < 8) {
                val = val.slice(0, 3) + ' ' + val.slice(3, val.length)
            } else if (val.length >= 8) {
                val =
                        val.slice(0, 3) +
                        ' ' +
                        val.slice(3, 7) +
                        ' ' +
                        val.slice(7, val.length)
            }
            return val
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
    },
    onUnload() {
        this.$bus.off('update:reception/reception')
    },
    methods: {
        checkNum(number) {
            if (
                (!this.phoneNumber && number == '0') ||
                    this.phoneNumber.length > 10 ||
                    this.wrongtxt
            ) { return }
            this.phoneNumber += number
            switch (this.phoneNumber.length) {
            case 3:
                if (!/^(((13[0-9])|(15[0-9])|(17[0-9])|(18[0-9])|(14[0-9])|(16[5-8])|(19[0-9])))$/.test(this.phoneNumber)) {
                    this.wrongtxt = '输入的手机号码不合格'
                }
                break
            case 11:
                this.$http.post(API_RECEPTION_INFO, { phone: this.phoneNumber }).then(data => {
                    this.$navigate({
                        url: '/pages/customer/detail',
                        query: {
                            id: data.info.id
                        }
                    })
                }).catch(error => {
                    this.$toast(error)
                })
                break
            }
        },
        removeNum() {
            if (this.phoneNumber) {
                this.wrongtxt = ''
                this.phoneNumber = this.phoneNumber.slice(0, this.phoneNumber.length - 1)
            }
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .activation {
        height: 600rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
    }

    .activation .input {
        font-size: 48rpx;
        color: #6f727d;
        text-align: center;
    }

    .activation .input.active {
        font-size: 68rpx;
        font-weight: bold;
        color: #c7d2ec;
    }

    .activation .tip {
        color: #f65364;
        font-size: 30rpx;
        height: 32rpx;
    }
</style>
