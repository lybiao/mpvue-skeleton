<template>
    <base-page color="black" :show-place="false">
        <template slot="header">
            <base-header title="邀请二维码"></base-header>
        </template>
        <template slot="main">
            <div class="qrcode-wrap">
                <div class="card">
                    <image class="bg" mode="scaleToFill"></image>
                    <div class="top bgauto">
                        <div class="qrcode">
                            <canvas canvas-id="invitation" style="width:120px; height: 120px;"></canvas>
                        </div>
                        <div class="tip">识别二维码</div>
                    </div>
                    <div class="bottom">
                        <div class="lf bgauto imgsd" :style="user.img_face ? 'background-image:url(' + user.img_face + ')' : ''"></div>
                        <div class="rg">
                            <p class="name">{{ user.name }}</p>
                            <p>邀请您加入</p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { PageMixin } from '@/mixins'
import { drawQRCode } from '@/utils'

export default {
    mixins: [PageMixin],
    data() {
        return {}
    },
    computed: {
        ...mapGetters(['user'])
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data())
        this.getQRCodeURL()
    },

    methods: {
        getQRCodeURL() {
            drawQRCode({ width: 120, height: 120, text: '邀请二维码链接' })
        }
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .qrcode-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;

        .card {
            width: 526rpx;
            height: 984rpx;
            border-radius: 30rpx;
            overflow: hidden;
            position: relative;
        }

        .bg{
            background-color: #252b36;
        }
    }

    .top {
        height: 690rpx;
        padding-top: 80rpx;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;

        .qrcode {
            padding: 5px;
            width: 120px;
            height: 120px;
            border-radius: 15rpx;
            background: #fff;
            margin: 234rpx auto 0;
            overflow: hidden;
        }

        .tip {
            font-size: 26rpx;
            font-weight: 400;
            line-height: 34rpx;
            text-align: center;
            padding-top: 42rpx;
            padding-bottom: 150rpx;
        }
    }

    .bottom {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 120rpx;
        padding: 10rpx 20rpx;
        background-color: #fff;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;

        .lf {
            width: 80rpx;
            height: 80rpx;
            border-radius: 50%;
            background-color: #f1f1f1;
        }

        .rg {
            width: 75%;
            margin-left: 20rpx;

            p:last-child {
                font-size: 22rpx;
                font-weight: 400;
                line-height: 32rpx;
                color: #888;
            }

            .name {
                font-size: 30rpx;
                font-weight: 500;
                line-height: 42rpx;
                color: #000;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

</style>
