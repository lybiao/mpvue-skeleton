<template>
    <base-page>
        <template slot="header">
            <base-header></base-header>
        </template>
        <template slot="main">
            <div class="guide">
                <div class="user">
                    <p class="title">个人信息</p>
                    <div class="item" @click.stop="toCropper" hover-class="hover-class">
                        <p>头像</p>
                        <i class="imgsd bgauto" :style="user.img_face ? 'background-image:url(' + user.img_face +')' : vlogo"></i>
                    </div>
                </div>
                <div class="btn" @click="exit" hover-class="hover-class">退出登录</div>
            </div>
        </template>
    </base-page>
</template>
<script>
import { mapGetters } from 'vuex';
import { INIT_USER_INFO, UPDATE_USER_INFO } from '@/store/user';
import { PageMixin } from '@/mixins';
import { cropper } from '@/utils';


export default {
    mixins: [PageMixin],
    data() {
        return {
            isEmitBus: false
        };
    },
    computed: {
        ...mapGetters(['user'])
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
    },
    onUnload() {
        this.$bus.off('cropper-image');
    },
    methods: {
        toCropper() {
            if (!this.isEmitBus) {
                this.isEmitBus = true;
                this.$bus.on('cropper-image', (img_face) => {
                    this.upload(img_face);
                    this.isEmitBus = false;
                });
            }
            cropper().then(tempFilePath => {
                this.$navigate({
                    url: '/pages/tools/cropper',
                    query: {
                        img: tempFilePath
                    }
                });
            });
        },
        upload(img_face) {
            if (this.flag) return;
            this.flag = true;

            if(this.openmock) {
                this.$store.commit(UPDATE_USER_INFO, { img_face });
                this.flag = false;
                return false
            }
            //修改头像逻辑
        },
        exit() {
            this.$store.dispatch(INIT_USER_INFO);
            mpvue.clearStorage();
            mpvue.reLaunch({
                url: '/pages/login/login'
            });
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .guide {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 9999;
        color: #fff;
    }

    .guide .user {
        padding: 36rpx 0 36rpx 0;
    }

    .guide .user .title {
        margin-left: 36rpx;
        font-size: 24rpx;
        color: #ABABAB;
        padding-bottom: 17rpx;
        border-bottom: 1rpx solid #3E434D;
    }

    .guide .item {
        padding-left: 36rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 110rpx;
        font-size: 26rpx;
        padding-right: 36rpx;
        position: relative;
    }

    .guide .item:active {
        background: rgba(37, 43, 54, 1);
    }

    .guide .item p {
        flex: 1;
    }

    .guide .item i {
        width: 70rpx;
        height: 70rpx;
        border-radius: 100%;
    }

    .guide .item input {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
    }

    .guide .item:after {
        content: "\e900";
        font-family: icomoon !important;
        font-size: 24rpx;
        color: #ccc;
        line-height: 1;
        margin-left: 15rpx;
    }

    .guide .item:before {
        position: absolute;
        left: 29rpx;
        content: "";
        height: 1rpx;
        width: 120%;
        background-color: #3E434D;
        bottom: 0;
    }

    .guide .btn {
        width: 642rpx;
        height: 106rpx;
        background-color: #252b36;
        border-radius: 22rpx;
        margin: 70rpx auto;
        color: #fff;
        text-align: center;
        line-height: 106rpx;
        font-size: 30rpx;
        font-weight: bold;
    }
</style>
