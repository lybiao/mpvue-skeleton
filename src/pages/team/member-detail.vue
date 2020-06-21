<template>
    <base-page>
        <template slot="header">
            <base-header @right="supervise">
                <template slot="right">
                    <i class="icon-189"></i>
                </template>
            </base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <scroll-view @scrolltolower="getListData" class="scroll-view" :scroll-y="true">
                    <div class="freeze" v-if="info.state && user.roleenum == '管理员'">
                        <i class="icon-169"></i>
                        <span>账号已冻结</span>
                    </div>
                    <div class="top">
                        <div class="user-info">
                            <div class="avatar imgsd bgauto" :style="info.img_face ? 'background-image:url(' + info.img_face +')' :''"></div>
                            <div class="md">
                                <p>{{ info.name }}</p>
                                <p>
                                    {{ info.roleenum }}
                                    <template v-if="info.roleenum != '部长'"> | {{ info.ref_name }}团队</template>
                                </p>
                            </div>
                            <div class="call" @click.stop="callPhone"><i class="icon-298"></i></div>
                        </div>
                        <div class="result">
                            <ul>
                                <li>
                                    <h3>今日业绩</h3>
                                    <p class="today">{{ info.today || 0 }}</p>
                                </li>
                                <li>
                                    <h3>昨日业绩</h3>
                                    <p class="yesterday">{{ info.yesterday || 0 }}</p>
                                </li>
                                <li>
                                    <h3>累计业绩</h3>
                                    <p class="total">{{ info.total || 0 }}</p>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <h3>今日收益</h3>
                                    <p class="today">{{ info.todayreward }}</p>
                                </li>
                                <li>
                                    <h3>昨日收益</h3>
                                    <p class="yesterday">{{ info.yesterdayreward }}</p>
                                </li>
                                <li>
                                    <h3>累计收益</h3>
                                    <p class="total">{{ info.totalreward }}</p>
                                </li>
                            </ul>
                        </div>
                        <div class="ta">
                            <div class="item" @click.stop="toCoustomerList">TA的客户 {{ info.cus_count || 0 }}</div>
                            <div class="item" @click.stop="toMemberDetail" v-if="info.roleenum!='经理'">TA的团队 {{ info.team_count || 0 }}</div>
                        </div>
                    </div>
                    <ul class="list">
                        <li v-for="(item,index) in list" @click.stop="toPerformance(item)" :key="index">
                            <p>{{ item.newdate }}业绩</p>
                            <p>{{ item.wealth }}</p>
                        </li>
                    </ul>
                </scroll-view>
                <template v-if="!list.length">
                    <div class="tip">暂时没有销售业绩</div>
                </template>
            </div>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_PROFIT_DETAIL, API_ADMIN_PROFIT_DETAILLIST, API_ADMIN_MANAGE_FREEZE } from '@/api';
import { mapGetters } from 'vuex';
const MAX_SIZE = 20;


export default {
    computed: {
        ...mapGetters(['user'])
    },
    data() {
        return {
            info: {},
            list: [],
            pageIndex: 1,
            isloaded: false,
            args: {}
        };
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);

        this.getData();
    },
    methods: {
        callPhone() {
            mpvue.makePhoneCall({
                phoneNumber: this.info.phone
            });
        },
        getData() {
            this.$http.post(API_ADMIN_PROFIT_DETAIL, { id: this.args.id }).then(data => {
                data.info.todayreward = parseInt(data.info.todayreward) || 0;
                data.info.yesterdayreward = parseInt(data.info.yesterdayreward) || 0;
                data.info.totalreward = parseInt(data.info.totalreward) || 0;
                this.info = data.info;
                this.nomore = false;
                this.pageIndex = 1;
                this.list = [];
                this.getListData();
            }).catch(erro => {
                this.$toast(erro);
            });
        },
        getListData() {
            if (this.nomore || this.isFetching) return;
            this.isFetching = true;
            this.$http.post(API_ADMIN_PROFIT_DETAILLIST, { id: this.args.id, page: this.pageIndex, size: MAX_SIZE }).then(data => {
                this.isFetching = false;
                const { list } = data;
                if (list.length < MAX_SIZE) this.nomore = true;

                list.forEach(item => {
                    item.newdate = this.$formatTime(item.date, 'MM月dd日');
                });

                this.list = this.list.concat(list);
                this.pageIndex++;
            }).catch((erro) => {
                this.isFetching = false;
                this.$toast(erro);
            });
        },
        supervise() {
            let sheetOptions = ['身份设置'];
            sheetOptions.push(!this.info.state ? '冻结账号' : '解冻帐号');

            mpvue.showActionSheet({
                itemList: sheetOptions,
                itemColor: '#000',
                success: (res) => {
                    if (res.cancel) return false;

                    let option = res.tapIndex;

                    if (option === 1) {
                        this.$http.post(API_ADMIN_MANAGE_FREEZE, { id: this.args.id, type: this.info.state ? 1 : 0 }).then(data => {
                            this.info.state = !this.info.state;
                        }).catch(erro => {
                            this.$toast(erro);
                        });
                    } else if (option == 0) {
                        this.$navigate({
                            url: '/pages/team/setting',
                            query: {
                                id: this.args.id
                            }
                        });
                    }
                }
            });
        },
        toMemberDetail() {
            this.$navigate({
                url: '/pages/manager/member-detail',
                query: {
                    id: this.args.id
                }
            });
        },
        toCoustomerList() {
            this.$navigate({
                url: '/pages/manager/customer-list',
                query: {
                    id: this.args.id
                }
            });
        },
        toPerformance(item) {
            this.$navigate({
                url: '/pages/customer/performance',
                query: {
                    id: this.args.id,
                    item,
                    role: this.info.roleenum
                }
            });
        }
    }
};
</script>
<style lang="less" type="text/less" scoped>
    .freeze {
        width: 218rpx;
        height: 58rpx;
        background: rgba(255, 45, 85, 1);
        border-radius: 29rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        margin: 0 auto 68rpx;
        font-size: 24rpx;
        .icon-169 {
            margin-right: 10rpx;
        }
    }

    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-wrap {
        .tip {
            font-size: 26rpx;
            font-weight: 400;
            color: rgba(110, 116, 129, 1);
            line-height: 36rpx;
            position: absolute;
            top: 850rpx;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 9;
        }
    }

    .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 29rpx;
        padding-right: 29rpx;
        margin-top: 50rpx;

        .avatar {
            width: 120rpx;
            height: 120rpx;
            border-radius: 50%;
            margin-right: 22rpx;
        }

        .md {
            flex: 1;

            p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 300rpx;
            }
            p:first-child {
                font-size: 48rpx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 66rpx;
            }

            p:last-child {
                font-size: 26rpx;
                font-weight: 500;
                color: rgba(44, 201, 233, 1);
                line-height: 36rpx;
            }
        }

        .call {
            width: 94rpx;
            height: 94rpx;
            background: rgba(34, 39, 49, 1);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            &:active {
                background-color: rgba(255, 255, 255, 0.2);
            }

            i {
                font-size: 36rpx;
                color: #4CD964;
            }
        }

    }

    .result {
        padding: 0 30rpx;
        margin: 100rpx 0 40rpx;
        ul {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 40rpx;
        }

        li {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
        }

        h3 {
            font-size: 24rpx;
            font-weight: 500;
            color: rgba(255, 255, 255, 1);
            line-height: 34rpx;
            text-align: center;
        }

        p {
            font-size: 42rpx;
            font-weight: 500;
            line-height: 52rpx;
            text-align: center;
            padding-top: 12rpx;
        }

        ul:first-child p {
            color: rgba(44, 201, 233, 1);
        }

        ul:last-child p {
            color: rgba(244, 99, 135, 1);
        }

    }

    .ta {
        display: flex;
        margin: 0 26rpx 60rpx;
    }

    .ta .item {
        flex: 1;
        height: 120rpx;
        line-height: 120rpx;
        text-align: center;
        background: rgba(37, 43, 54, 1);
        border-radius: 24rpx;
        font-size: 30rpx;
        font-weight: 500;
        color: rgba(187, 194, 210, 1);

        &:last-child {
            margin-left: 20rpx;
        }

        &:first-child {
            margin-left: 0;
        }

        &:active {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }

    .role-wrap .list {
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 140rpx;
            padding-right: 29rpx;
            position: relative;
            padding-left: 29rpx;

            &:first-child::before, &::after {
                position: absolute;
                left: 29rpx;
                content: "";
                height: 1rpx;
                width: 120%;
                background-color: rgba(62, 67, 77, 1);
            }

            &:first-child::before {
                top: 0;
            }

            &::after {
                bottom: 0;
            }

            &:active {
                background: rgba(37, 43, 54, 1);
            }

            p:first-child {
                font-size: 30rpx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
            }
            p:last-child {
                font-size: 32rpx;
                font-weight: 500;
                color: rgba(151, 160, 180, 1);
            }
        }

    }
</style>
