<template>
    <base-page>
        <template slot="header">
            <base-header @left="toExit" :custom-return="true" left-type="exit"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="card-box">
                    <ul class="card" :class="[args.role]">
                        <li>
                            <div class="avatar bgauto" :style="user.img_face ? 'background-image:url(' + user.img_face +')' :''"></div>
                        </li>
                        <li class="info">
                            <span>{{ rewardHome.info.name }}</span>
                            <span>{{ rewardHome.info.roleenum }}</span>
                        </li>
                        <li class="money">￥{{ rewardHome.wealth_count }}</li>
                    </ul>
                </div>
                <div class="role-hd">
                    <ul class="btn-group">
                        <li class="btn" @click="toMemberDetail" v-if="hasTeam">团队 {{ rewardHome.team_count }}</li>
                        <li class="btn" @click="toCustomerManage('manager')">客户 {{ rewardHome.cus_count }}</li>
                    </ul>
                </div>
                <div class="role-list" :class="{nodata: !list.length && isloaded}">
                    <scroll-view class="scroll-view" :scroll-y="true" @scrolltolower="getData">
                        <ul class="list">
                            <li class="item" @click="toEarnings(item)" v-for="(item,index) in list" :key="index">
                                <p class="text">{{ item.newdate }}收益</p>
                                <p class="money">+{{ item.money }}</p>
                            </li>
                        </ul>
                        <template v-if="!list.length">
                            <div class="tip" v-if="isloaded">暂时还没有收益</div>
                            <div class="tip" v-if="!list.length && pageIndex===1 && !isloaded">加载中...</div>
                        </template>
                    </scroll-view>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_ACCOUNT_REWRADLIST, API_ACCOUNT_REWRADHOME } from '@/api';


const MAX_SIZE = 20;


export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            nomore: false,
            isFetching: false,
            args: { role: 'manager' },
            isloaded: false,
            rewardHome: {
                info: {
                    img_face: '',
                    name: '',
                    roleenum: ''
                },
                team_count: 0,
                wealth_count: 0
            }
        };
    },
    computed: {
        ...mapGetters(['user']),
        hasTeam() {
            return ['director', 'minister'].includes(this.args.role);
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.getRole();
        this.getRewardHome();
        this.getData();


        this.$bus.on('update:user/role', () => {
            this.getRewardHome();
            this.getData();
        });
    },
    onUnload() {
        this.$bus.off('update:user/role');
    },
    methods: {
        getRole() {
            let roleMap = {
                经理: 'manager',
                部长: 'minister',
                总监: 'director'
            };
            let roles = Object.keys(roleMap);
            if (!roles.includes(this.user.roleenum)) {
                this.back();
                return false;
            }

            this.args.role = roleMap[this.user.roleenum];
        },
        getRewardHome() {
            this.$http.post(API_ACCOUNT_REWRADHOME).then(res => {
                this.rewardHome = { ...this.rewardHome, ...res };
                this.rewardHome.wealth_count = parseInt(this.rewardHome.wealth_count).toFixed(2);
            }).catch((erro) => {
                this.$toast(erro);
            });
        },
        getData() {
            if (this.pageIndex === 1) {
                this.isFetching = false;
                this.nomore = false;
            }
            if (this.nomore || this.isFetching) return;
            this.isFetching = true;
            this.$http.post(API_ACCOUNT_REWRADLIST, { page: this.pageIndex, size: MAX_SIZE }).then(data => {
                this.isFetching = false;
                this.isloaded = true;
                const { list } = data;
                if (list.length < MAX_SIZE) this.nomore = true;

                list.forEach(item => {
                    item.newdate = this.$formatTime(item.date, 'M月d日');
                });

                if (this.pageIndex === 1) {
                    this.list = list;
                } else {
                    this.list = this.list.concat(list);
                }
                this.pageIndex++;
            }).catch((erro) => {
                this.isloaded = true;
                this.isFetching = false;
                this.$toast(erro);
            });
        },
        toMemberDetail() {
            this.$navigate({
                url: '/pages/manager/member-detail',
                query: {
                    id: this.user.id
                }
            });
        },
        toEarnings(item) {
            this.$navigate({
                url: '/pages/customer/earnings',
                query: {
                    ...item
                }
            });
        },
        toCustomerManage(role) {
            this.$navigate({
                url: '/pages/customer/manage',
                query: {
                    role,
                    total: this.rewardHome.team_count
                }
            });
        },
        toExit() {
            this.$navigate({
                url: '/pages/user/exit'
            });
        }
    }
};
</script>

<style lang="less" type="text/less" scoped>
    .tip {
        font-size: 30rpx;
        font-weight: 400;
        color: rgba(110, 116, 129, 1);
        line-height: 42rpx;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
    }


    .card-box {
        position: relative;
        height: 377rpx;
        margin: 30rpx 30rpx 0;
    }

    .card {
        height: 291rpx;
        border-radius: 20rpx;
        padding: 38rpx;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: #252b36;

        li:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .avatar {
            width: 96rpx;
            height: 96rpx;
            border-radius: 50%;
            margin-top: -10rpx;
        }

        .info {
            display: flex;
            align-items: center;
            padding-top: 40rpx;

            span {
                display: inline-block;
                padding-right: 58rpx;
                line-height: 36rpx;
                font-size: 30rpx;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }

            span:first-child {
                max-width: 400rpx;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            p {
                font-size: 49rpx;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
                line-height: 61rpx;
            }

        }

        .money {
            margin-top: 49rpx;
            margin-bottom: 16rpx;
            font-size: 58rpx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 61rpx;
            position: relative;
            text-indent: -7rpx;
            font-family: btn;
        }

        .money::after {
            content: "";
            position: absolute;
            top: 50%;
            right: -10rpx;
            transform: translate(0, -50%);
            font-size: 40rpx;
            content: "\e900";
            font-family: icomoon !important;
            color: #fff;
        }
    }

    .plr {
        padding: 30rpx;
    }

    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-hd {
        margin: 26rpx;
    }

    .role-list {
        flex: 1;
        position: relative;
        margin-top: 34rpx;
    }

    .btn-group {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:last-child {
            margin-top: 48rpx;
        }

        .btn {
            flex: 1;
            height: 102rpx;
            background: rgba(37, 43, 54, 1);
            border-radius: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 30rpx;
            font-weight: 500;
            color: rgba(187, 194, 210, 1);
            line-height: 36rpx;

            &:active {
                background: rgba(37, 43, 54, 0.6);
            }

            &:last-child {
                margin-left: 20rpx;
            }

            &:first-child {
                margin-left: 0;
            }

            .icon {
                font-size: 38rpx;
                width: 38rpx;
                height: 38rpx;
                display: inline-block;
            }
        }
    }

    .nodata {
        border-top: 1rpx solid rgba(62, 67, 77, 1);
        margin-left: 30rpx;
    }

    .role-list .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 118rpx;
        position: relative;
        padding: 0 34rpx 0 27rpx;

        &::after {
            position: absolute;
            left: 29rpx;
            right: 0;
            bottom: 0;
            content: "";
            height: 1rpx;
            background-color: rgba(62, 67, 77, 1);
        }

        &:active {
            background-color: rgba(255, 255, 255, 0.2);
        }

        .text {
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 36rpx;
        }
        .money {
            font-size: 32rpx;
            font-weight: 500;
            color: rgba(244, 99, 135, 1);
            line-height: 34rpx;
        }
    }
</style>
