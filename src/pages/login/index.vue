<template>
    <base-page :show-place="false" color="black">
        <template slot="main">
            <div class="login-box" @click="isEnter=false">
                <div class="bottom" :class="{top:isEnter}">
                    <div class="text">登录</div>
                    <div class="phone" :class="{hover: keyBorderType=='phone'&&isEnter}" @click.stop="showKeyBoard('phone')" :style="phone ? 'color: #fff !important;': ''">
                        {{ phone ? phone : '输入手机号码' }}
                        <image src="/static/clear.png" v-if="phone && !code" @click.stop="clearPhone"></image>
                    </div>
                    <div class="code">
                        <div :class="{hover: keyBorderType=='code'&&isEnter}" @click.stop="showKeyBoard('code')" :style="code ? 'color: #fff !important;': ''">{{ code ? code : '验证码' }}</div>
                        <span class="obtain" :class="[{active: active}, {second: second}]" @click.stop="getSmsCode" :disabled="second">{{ second ? second+'秒' : '获取' }}</span>
                    </div>
                    <div class="btn" :class="{enter:isPass}" @click.stop="loginEnter">确定</div>
                </div>
            </div>
        </template>
        <template slot="export">
            <Keyboard @checkNum="checkNum" :phone-num="phoneNum" @removeNum="removeNum" v-if="isEnter" :is-login="true" />
        </template>
    </base-page>
</template>

<script>
import { API_LOGIN } from '@/api'
import { PageMixin } from '@/mixins'
import Keyboard from '@/pages/components/keyboard'
import { isPhone } from '@/utils'
import { SET_USER_INFO } from '@/store/user'


export default {
    mixins: [PageMixin],
    components: {
        Keyboard
    },
    data() {
        return {
            phone: '18000000002',
            code: '',
            second: 0,
            active: false,
            isLogin: false,
            isEnter: false,
            phoneNum: true,
            keyBorderType: ''
        }
    },
    computed: {
        isPass() {
            return isPhone.test(this.phone) && this.code.length === 4
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        let loginPhone = mpvue.getStorageSync('loginPhone')
        if (loginPhone) {
            this.active = true
            this.phone = `${loginPhone}`
        }
    },
    onUnload() {
        this.$bus.off('user/imgface')
    },
    methods: {
        clearPhone() {
            this.phone = ''
            this.active = false
        },
        showKeyBoard(type) {
            if ((!this.phone || this.phone.length != 11) && type == 'code') {
                this.keyBorderType = 'phone'
                this.isEnter = true
                return
            }
            this.keyBorderType = type
            this.isEnter = true
        },
        checkNum(data) {
            if (this.keyBorderType == 'phone') {
                if (this.phone.length >= 11) return
                this.phone += data
                if (this.phone.length === 11) {
                    if (isPhone.test(this.phone)) {
                        this.active = true
                    } else {
                        this.$toast('请输入正确的手机号')
                    }
                }
            } else {
                if (this.code.length >= 4) return
                this.code += data
            }
        },
        removeNum() {
            if (this.keyBorderType == 'phone') {
                this.phone = this.phone.length > 1 ? this.phone.substring(0, this.phone.length - 1) : ''
                this.code = ''
                this.active = false
            } else {
                this.code = this.code.length > 1 ? this.code.substring(0, this.code.length - 1) : ''
            }
        },
        // 获取验证码
        getSmsCode() {
            this.isEnter = false
            if (!this.phone) {
                this.keyBorderType = 'phone'
                this.isEnter = true
                return
            }
            if (this.active) this.sendCode()
        },
        sendCode() {
            this.setTime()
            this.second = 59
            this.active = false
            //请求验证码
            console.log('======== 请求验证码')
            console.log('======== 请求验证码')
        },
        setTime() {
            this.t = setInterval(() => {
                this.second--
                if (this.second == 0) {
                    clearInterval(this.t)
                    this.active = true
                }
            }, 1000)
        },
        getCode(data) {
            this.code = data
        },
        loginEnter() {
            if (!this.phone) {
                this.keyBorderType = 'phone'
                this.isEnter = true
                return
            }
            if (!this.code) return this.$toast('请输入验证码')
            this.$showLoading({
                title: '正在验证',
                mask: true
            })


            let URL = API_LOGIN

            if(this.openmock) {
                let login = {
                    18000000001: 'api/checkout/login',
                    18000000002: 'api/manager/login',
                    18000000003: 'api/minister/login',
                    18000000004: 'api/reception/login'
                }
                URL = login[this.phone] || login['18000000004']
            }

            this.$http.post(URL, { phone: this.phone, smscode: this.code }).then((data) => {
                mpvue.setStorageSync('loginPhone', this.phone)
                mpvue.setStorageSync('token', data.token)
                this.$hideLoading()
                this.$store.dispatch(SET_USER_INFO, data.user)
                this.toByRole(data.user)
            }).catch((error) => {
                this.$hideLoading()
                this.$toast(error)
            })
        },
        toByRole(user) {
            let routerName = ''
            let params = {}
            switch (user.roleenum) {
            case '前台':
                routerName = '/pages/reception/reception'
                break
            case '管理员':
                routerName = '/pages/manager/manager'
                break
            case '收银台':
                routerName = '/pages/checkout/counter'
                break
            case '部长':
            case '总监':
            case '经理':
                routerName = '/pages/user/role'
                break
            }
            if (!user.img_face) {
                this.$bus.on('user/imgface', () => {
                    if (routerName) this.$redirect({ url: routerName, query: params })
                })
                this.$navigate({ url: '/pages/user/imgface' })
                return false
            }
            if (routerName) this.$redirect({ url: routerName, query: params })
        }
    }
}

</script>

<style scoped>
    .login-box {
        width: 100%;
        height: 100%;
        position: relative;
    }

    .login-box .bottom {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 475rpx;
        left: 0;
        z-index: 3;
        transform: translateY(0);
        transition: transform 0.2s;
    }

    .login-box .bottom.top {
        transform: translateY(-300rpx);
    }

    .login-box .bottom {
        text-align: center;
        color: rgba(255, 255, 255, 0.36);
    }

    .login-box .bottom .text {
        font-size: 72rpx;
        color: #fff;
        margin: 0rpx auto 225rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        padding: 0 20rpx;
    }

    .login-box .bottom .phone {
        display: block;
        width: 564rpx;
        height: 100rpx;
        line-height: 110rpx;
        font-size: 34rpx;
        padding-left: 38rpx;
        background-color: rgba(255, 255, 255, 0.09);
        border-radius: 50rpx;
        text-align: left;
        position: relative;
        margin: 0 auto 28rpx;
    }

    .login-box .bottom .phone:active, .login-box .bottom .code div:active {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .login-box .bottom .phone.hover, .login-box .bottom .code div.hover {
        box-shadow: 0 0 20rpx rgba(255, 255, 255, 0.3) inset;
    }

    .login-box .bottom .phone image {
        width: 38rpx;
        height: 38rpx;;
        position: absolute;
        top: 50%;
        right: 34rpx;
        transform: translateY(-50%);
        background-size: 100%;
    }

    .login-box .bottom .code {
        width: 100%;
        height: 100rpx;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-box .bottom .code div {
        width: 362rpx;
        height: 100rpx;
        background-color: rgba(255, 255, 255, 0.09);
        border-radius: 50rpx;
        font-size: 34rpx;
        font-weight: 400;
        padding-left: 38rpx;
        line-height: 110rpx;
        text-align: left;
    }

    .login-box .bottom .code span {
        margin-left: 19rpx;
    }

    .login-box .bottom .obtain {
        display: inline-block;
        width: 172rpx;
        height: 100rpx;
        border-radius: 50rpx;
        font-size: 34rpx;
        font-weight: 400;
        line-height: 110rpx;
        text-align: center;
        background-color: rgba(255, 255, 255, 0.09);
        color: rgba(255, 255, 255, 0.36);
    }

    .login-box .bottom .active {
        background: #9F71FF;
        color: #fff;
    }

    .login-box .bottom .second {
        color: #FFA000;
    }

    .login-box .bottom .btn {
        width: 564rpx;
        height: 100rpx;
        margin: 0 auto 28rpx;
        border: 2rpx solid rgba(255, 255, 255, 0.29);
        margin-top: 51rpx;
        line-height: 110rpx;
        font-size: 34rpx;
        text-align: center;
        border-radius: 50rpx;
    }

    .login-box .bottom .enter {
        border: none;
        background: #9F71FF;
        color: #fff;
    }
</style>
