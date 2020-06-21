<template>
    <base-page>
        <template slot="header">
            <base-header :title="title" title-class="zero" right-width="40" @right="setPhone">
                <template slot="right">
                    <div class="btn">完成</div>
                </template>
            </base-header>
        </template>
        <template slot="main">
            <div class="phone" @click.stop="isSearch=true" :class="{'active':!isSearch}" v-if="isSearch">{{ phone }}</div>
            <div class="phone" @click.stop="isSearch=true" :class="{'active':!isSearch}" v-else>请输入手机号码</div>
        </template>
        <template slot="export">
            <Keyboard @checkNum="checkNum" :phone-num="phoneNum" @removeNum="removeNum" v-if="isSearch" :is-login="isSearch" />
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ADMIN_ADD } from '@/api'
import Keyboard from '@/pages/components/keyboard'


export default {
    mixins: [PageMixin],
    components: {
        Keyboard
    },
    data() {
        return {
            title: '',
            args: {},
            phoneNum: true,
            phone: '',
            isSearch: false
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.title = this.args.role == 5 ? '设置收银台账号' : '设置前台账号'
    },
    methods: {
        checkNum(data) {
            if (this.phone.length >= 11) return
            this.phone += data
        },
        removeNum() {
            if (this.phone.length > 1) {
                this.phone = this.phone.substring(0, this.phone.length - 1)
            } else {
                this.phone = ''
            }
        },
        setPhone() {
            if (this.phone.length < 11) return this.$toast('你输入的手机号错误')
            let params = {
                phone: this.phone,
                role: this.args.role,
                name: this.args.role == 5 ? '收银台' : '前台'
            }
            this.$http.post(API_ADMIN_ADD, params).then(d => {
                this.$bus.emit('phone', params)
                this.back()
            }).catch((error) => {
                this.$toast(error)
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .btn {
        width: 116rpx;
        height: 54rpx;
        background:  #252b36;
        border-radius: 10rpx;
        text-align: center;
        line-height: 54rpx;
        font-size: 24rpx;
        color: #fff;
    }

    .phone {
        height: 90rpx;
        margin: 0 48rpx 0 36rpx;
        border-bottom: 1rpx solid #979797;
        text-align: left;
        line-height: 102rpx;
        font-size: 30rpx;
        color: #fff;
    }

    .phone.active {
        color: #979797;
    }
</style>
