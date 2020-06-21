<template>
    <base-page :show-place="false">
        <template slot="main">
            <view class="cropper-wrapper">
                <mpvue-cropper ref="cropper" :option="cropperOptions"></mpvue-cropper>
                <view class="cropper-buttons"></view>
                <view class="box">
                    <view class="load-mask" v-if="!isLoad"></view>
                    <view class="upload" @click.stop="back" hover-class="hover-class">返回</view>
                    <view class="getCropperImage" hover-class="hover-class" @click.stop="getCropperImage">使用</view>
                </view>
            </view>
        </template>
        <template slot="export">
            <image class="laod-image" :src="imgSrc" @load="initLoad" @error="error"></image>
        </template>
    </base-page>
</template>


<script>

import MpvueCropper from 'mpvue-cropper'
import { PageMixin } from '@/mixins'
import { buildUUID, waiting } from '@/utils'


const device = mpvue.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight
let wecropper


export default {
    mixins: [PageMixin],
    components: {
        MpvueCropper
    },
    data() {
        return {
            cropperOptions: {
                id: 'cropper',
                targetId: 'targetCropper',
                pixelRatio: device.pixelRatio,
                width,
                height: height - 50,
                scale: 2.5,
                zoom: 8,
                cut: {
                    x: (width - 300) / 2,
                    y: (height - 300) / 2,
                    width: 300,
                    height: 300
                },
                boundStyle: {
                    color: '#04b00f',
                    mask: '#e5e5e5',
                    lineWidth: 1
                }
            },
            imgSrc: '',
            isLoad: false
        }
    },
    onLoad(option) {
        Object.assign(this.$data, this.$options.data())
        if (option.img) {
            this.imgSrc = option.img
            this.$showLoading({
                title: '加载中...',
                mask: true
            })
        }
    },
    mounted() {
        const self = this
        wecropper = self.$refs.cropper
        self.uploadTap(self.imgSrc)
    },
    onUnload() {
        this.offEventBus()
    },
    methods: {
        offEventBus() {
            this.$bus.off('cropper-image')
        },
        initLoad() {
            this.isLoad = true
            waiting(500).then(() => {
                this.$hideLoading()
            })
        },
        error() {
            this.isLoad = false
            waiting(500).then(() => {
                this.$hideLoading()
            })
        },
        uploadTap(src) {
            wecropper.pushOrigin(src)
            wecropper.updateCanvas()
        },
        uploadImage(src) {
            const uuid = buildUUID()
            const fileName = uuid + '_1280x640.png'

            const syncEventBus = fileName => {
                console.log('====== 自定义名称: ', fileName)
                console.log('====== 本地临时的截切图片: ', src)
                this.$bus.emit('cropper-image', src)
            }

            syncEventBus(fileName)
            //使用 `mpvue.uploadFile` 封装自己的上传文件的逻辑
            waiting(1000).then(() => {
                this.back()
                this.$hideLoading()
            })
        },
        getCropperImage() {
            if (!this.isLoad) return false
            this.$showLoading({
                title: '裁剪中',
                mask: true
            })
            wecropper.getCropperImage({ original: true }).then(src => {
                this.uploadImage(src)
            }).catch((error) => {
                this.$toast('裁剪失败')
                this.$hideLoading()
            })
        }
    }
}
</script>


<style lang="less" type="text/less">
    .laod-image {
        position: fixed;
        top: 20000px;
        left: 20000px;
    }

    .cropper-wrapper {
        position: relative;
        height: 100%;
        background-color: #e5e5e5;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        flex-direction: column;
        background-color: #e5e5e5;

        canvas {
            background-color: #e5e5e5 !important;
        }

        .cropper-buttons {
            display: flex;
            justify-content: space-between;
            width: 100%;
            height: 50px;
            z-index: 9;
        }

        .upload,
        .getCropperImage {
            width: 50%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            &.hover-class {
                background-color: rgba(0, 0, 0, 0.65);
                color: #4eb052;
            }
        }

        .upload::after {
            display: block;
            content: "";
            height: 100%;
            width: 1 rpx;
            position: absolute;
            top: 0;
            right: 0;
            background-color: #333333;

        }

        .box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            z-index: 10;
            background-color: rgba(0, 0, 0, 0.95);
            color: #04b00f;

            .load-mask {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: transparent;
                z-index: 11;
            }
        }

    }


</style>
