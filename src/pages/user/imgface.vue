<template>
    <base-page>
        <template slot="header">
            <base-header></base-header>
        </template>
        <template slot="main">
            <div class="setimg">
                <div class="title">欢迎加入GFC<br>请设置你的个人头像</div>
                <div class="user" @click.stop="toCropper">
                    <div class="img imgsd bgauto" hover-class="hover-class" :style="userinfo.img_face ? 'background-image:url(' + userinfo.img_face +')' : vlogo"></div>
                    <p>{{ userinfo.name }}</p>
                </div>
                <div class="btn" :class="{active: userinfo.img_face}" @click="save" hover-class="hover-class">保存</div>
            </div>
        </template>
    </base-page>
</template>
<script>
import { mapGetters } from 'vuex';
import { PageMixin } from '@/mixins';
import { UPDATE_USER_INFO } from '@/store/user';
import { cropper } from '@/utils';


export default {
    mixins: [PageMixin],
    computed: {
        ...mapGetters(['user'])
    },
    data() {
        return {
            userinfo: {
                img_face: ''
            },
            isEmitBus: false
        };
    },
    onLoad() {
        Object.assign(this.$data, this.$options.data());
        this.userinfo = JSON.parse(JSON.stringify(this.user));
    },
    onUnload() {
        this.$bus.off('cropper-image');
        this.$bus.off('user/imgface');
    },
    methods: {
        toCropper() {
            if (!this.isEmitBus) {
                this.isEmitBus = true;
                this.$bus.on('cropper-image', (img_face) => {
                    this.userinfo.img_face = img_face;
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
        save() {
            if (this.flag) return;
            if (!this.userinfo.img_face) return this.$toast('请先设置个人头像');
            this.flag = true;

            if(this.openmock) {
                this.$store.commit(UPDATE_USER_INFO, { img_face: this.userinfo.img_face });
                this.flag = false;
                this.$toast('设置个人头像成功');
                this.$bus.emit('user/imgface');
                return false
            }
            //修改头像逻辑
        }
    }
};
</script>
<style scoped lang="less" type="text/less">
    .setimg {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        z-index: 3
    }

    .setimg .title {
        font-size: 54rpx;
        color: #C2D1F3;
        text-align: center;
        padding-top: 160rpx;
    }

    .setimg .user {
        width: 218rpx;
        margin: 0 auto;
    }

    .setimg .user .img {
        width: 256rpx;
        height: 256rpx;
        border-radius: 100%;
        background-color: #0c0e13;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .setimg .user p {
        font-size: 48rpx;
        color: #C2D1F3;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 25rpx;
    }

    .setimg .btn {
        width: 364rpx;
        height: 100rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 43rpx;
        margin: 200rpx auto 130rpx;
        text-align: center;
        line-height: 85rpx;
        font-size: 34rpx;
        color: #fff;
    }

    .setimg .btn.active {
        background: linear-gradient(180deg, rgba(239, 54, 87, 1) 0%, rgba(170, 0, 32, 1) 100%);
    }
</style>
