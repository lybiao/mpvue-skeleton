<template>
    <div :class="{active:isLogin}" class="box">
        <div class="keybox" :class="{keyPhone:phoneNum}">
            <div class="left">
                <div class="num">
                    <i :class="{phoneNum:phoneNum}" v-for="(item,index) in numList" :key="index" @click.stop="push(index+1)">{{ item }}</i>
                </div>
                <div class="zero">
                    <i class="zero-num" @click.stop="push('0')" :class="{zerowidth:phoneNum}">0</i>
                    <i @click.stop="push('.')" v-if="!phoneNum">·</i>
                    <i class="del-num" @click.stop="remove" :class="{phoneNum:phoneNum}" v-else>
                        <image src="/static/del.png"></image>
                    </i>
                </div>
            </div>
            <div class="right" v-if="!phoneNum">
                <i class="del-num left-del" @click.stop="remove">
                    <image src="/static/del.png"></image>
                </i>
                <i class="deduction" @click.stop="confirm">{{ text }}</i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            numList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            num: ''
        }
    },
    props: {
        color: {
            type: [String, Number],
            default: 0
        },
        phoneNum: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: '充值'
        },
        isLogin: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        push(text) {
            this.$emit('checkNum', text)
        },
        remove() {
            this.$emit('removeNum')
        },
        confirm() {
            this.$emit('confirm')
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .box {
        z-index: 9999;
        position: fixed;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        transform: translateY(100%);
        transition: transform 0.2s;
        bottom: 0;
    }

    .box.active {
        transform: translateY(0);
    }

    .keybox {
        display: flex;
        color: #fff;
        padding: 40rpx 30rpx 73rpx 12rpx;
    }

    .keybox.keyPhone {
        padding-left: 29rpx;
    }

    .keybox i {
        display: inline-block;
        width: 170rpx;
        height: 84rpx;
        text-align: center;
        line-height: 84rpx;
        border-radius: 42rpx;
        font-size: 39rpx;
        font-weight: 500;
        background-color: #252B36;
        vertical-align: middle;
    }

    .keybox .phoneNum {
        width: 220rpx;
    }

    .keybox .left {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    .keybox .right {
        width: 143rpx;
        margin-right: 14rpx;
    }

    .keybox .left .num i {
        margin: 0 14rpx 10rpx 0;
    }

    .keybox .left .num i:nth-child(3n) {
        margin-right: 0rpx;
    }

    .keybox .left .zero .zero-num {
        width: 354rpx;
        margin-right: 14rpx
    }

    .keybox .left .zero .zero-num.zerowidth {
        width: 452rpx;
    }

    .keybox .del-num {
        width: 220rpx;
    }

    .keybox .left-del {
        width: 170rpx;
    }

    .keybox .del-num image {
        width: 44rpx;
        height: 29rpx;
    }

    .keybox .right .deduction {
        height: 266rpx;
        margin-top: 10rpx;
        line-height: 266rpx;
        font-size: 36rpx;
    }

    .keybox .right .deduction:active {
        background-color: rgba(0, 0, 0, 0.3);
    }

    .keybox .right .deduction.bg1 {
        background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
    }

    .keybox .right .deduction.bg2 {
        background: linear-gradient(135deg, rgba(45, 201, 235, 1) 0%, rgba(20, 210, 184, 1) 100%);
    }

    .keybox .left .num i:active, .keybox .left .zero i:active {
        background-color: #c3cddf;
    }
</style>
