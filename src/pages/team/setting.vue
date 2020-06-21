<template>
    <base-page>
        <template slot="header">
            <base-header title="身份设置"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="user">
                    <i class="img bgauto imgsd" :style="info.img_face ? 'background-image:url(' + info.img_face +')' :''"></i>
                    <p class="name">{{ info.name }}</p>
                    <p class="title">{{ info.roleenum }}</p>
                </div>
                <div class="btns">
                    <div class="button" :class="{block: isBlock}" v-for="(item, index) in status" @click="setStatus(item, index)" :key="index" v-if="item!=info.roleenum">设置为{{ item }}</div>
                </div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_PROFIT_DETAIL, API_ADMIN_UPGRADE, API_ADMIN_DELETE } from '@/api';
import { mapGetters } from 'vuex';


export default {
    computed: {
        ...mapGetters(['user'])
    },
    data() {
        return {
            args: {},
            info: {},
            isBlock: false,
            role: {
                部长: 2,
                总监: 3,
                经理: 4
            },
            status: []
        };
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.getData();
        this.initRole();
    },
    methods: {
        initRole() {
            switch (this.user.roleenum) {
            case '管理员':
                this.status = ['部长', '总监', '经理', '客户'];
                break;
            case '部长':
                this.status = ['总监', '经理', '客户'];
                break;
            case '总监':
                this.status = ['经理', '客户'];
                break;
            case '经理':
                this.status = ['客户'];
                break;
            }
        },
        getData() {
            this.$http.post(API_ADMIN_PROFIT_DETAIL, { id: this.args.id }).then(data => {
                this.info = data.info;

                if (this.info.team_count || this.info.cus_count) {
                    this.isBlock = true;
                }
            }).catch(erro => {
                this.$toast(erro);
            });
        },
        setStatus(item, index) {
            if (this.isBlock) {
                mpvue.showModal({
                    content: `${this.info.name} 已经有团队成员或客户，不能继续调整级别。`
                });
            } else if (index == 0) {
                mpvue.showModal({
                    content: `你确定调整 ${this.info.name} 为${item}？`,
                    success(res) {
                        if (res.confirm) {
                            this.setStatusData({ masterId: this.user.id, role: this.role[item] });
                        }
                    }
                });
            } else {
                if (item == '客户') {
                    mpvue.showModal({
                        content: `你确定调整 ${this.info.name} 为普通${item}？`,
                        success(res) {
                            if (res.confirm) {
                                this.$http.post(API_ADMIN_DELETE, { id: this.args.id }).then(() => {
                                    this.back(-2);
                                }).catch(erro => {
                                    this.$toast(erro);
                                });
                            }
                        }
                    });
                    return;
                }

                this.$bus.once('choose-team', data => {
                    mpvue.showModal({
                        content: `你确定调整 ${this.info.name} 为${item}，<br>并归属于 ${data.name} 团队？`,
                        success(res) {
                            if (res.confirm) {
                                this.setStatusData({ masterId: data.id, role: this.role[item] });
                            }
                        }
                    });
                });
                this.$navigate({
                    url: '/pages/team/choose',
                    query: {
                        roleenum: item,
                        info: this.info
                    }
                });
            }
        },
        setStatusData(data) {
            if (this.flag) return;
            this.flag = true;
            this.$http.post(API_ADMIN_UPGRADE, { masterId: data.masterId, role: data.role, id: this.args.id }).then(() => {
                this.flag = false;
                this.back();
                this.$toast('设置成功');
            }).catch(erro => {
                this.flag = false;
                this.$toast(erro);
            });
        }
    }
};
</script>

<style scoped lang="less" type="text/less">
    .user {
        text-align: center;
        font-size: 42rpx;
        color: #fff;
        line-height: 1.3;
        padding-top: 100rpx;
    }

    .user .img {
        width: 135rpx;
        height: 135rpx;
        border-radius: 100%;
        display: inline-block;
        margin-bottom: 25rpx;
    }

    .user .title {
        font-size: 29rpx;
        color: #788195;
    }

    .btns {
        margin: 100rpx 60rpx;
    }

    .btns .button {
        height: 85rpx;
        border-radius: 43rpx;
        margin-top: 32rpx;
        color: #fff;
        border: none;
    }

    .btns .button:nth-child(1) {
        background: linear-gradient(314deg, rgba(100, 90, 255, 1) 0%, rgba(165, 115, 255, 1) 100%);
    }

    .btns .button:nth-child(2) {
        background: linear-gradient(153deg, rgba(241, 88, 135, 1) 0%, rgba(254, 155, 134, 1) 100%);
    }

    .btns .button:nth-child(3) {
        background: linear-gradient(135deg, rgba(45, 201, 235, 1) 0%, rgba(20, 210, 184, 1) 100%);
    }

    .btns .button:nth-child(4) {
        background: linear-gradient(233deg, rgba(148, 66, 232, 1) 0%, rgba(255, 112, 252, 1) 100%);
    }

    .btns .button.block {
        background: #ddd;
        color: #333;
    }
</style>
