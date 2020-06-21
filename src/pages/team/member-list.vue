<template>
    <base-page>
        <template slot="header">
            <base-header :title="title + ' (' + args.total + ')'"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="search role-hd" v-if="args.role===2">
                    <i class="icon-40"></i>
                    <input type="text" v-model.trim="serachKey" maxlength="20">
                </div>
                <div class="role-list" :class="{active: args.role===2}">
                    <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                        <ul class="list">
                            <li>
                                <span class="col">排名</span>
                                <span class="col">{{ title }}</span>
                                <span class="col">今日业绩</span>
                                <span class="col">昨日业绩</span>
                                <span class="col">累计</span>
                            </li>
                            <li @click="toMemberDetail(item)" v-for="(item, index) in list" :key="item.id">
                                <span class="col">{{ index + 1 }}</span>
                                <span class="col">{{ item.name }}</span>
                                <span class="col">{{ item.today }}</span>
                                <span class="col">{{ item.yesterday }}</span>
                                <span class="col">{{ item.total }}</span>
                            </li>
                        </ul>
                    </scroll-view>
                    <template v-if="!list.length">
                        <div class="tip" v-if="isloaded">暂时没有团队成员</div>
                        <div class="tip" v-if="!list.length && pageIndex===1 && !isloaded">加载中...</div>
                    </template>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { API_ADMIN_PROFIT_LIST } from '@/api';
import { mapGetters } from 'vuex';


const MAX_SIZE = 20;
const titleMap = {
    2: {
        title: '部长',
        msg: '暂时没有团队成员'
    },
    3: {
        title: '总监',
        msg: '暂时没有团队成员'
    },
    4: {
        title: '经理',
        msg: '暂时没有团队成员'
    },
    5: {
        title: '团队',
        msg: '暂时没有团队成员'
    }
};


export default {
    data() {
        return {
            list: [],
            pageIndex: 1,
            args: {
                total: 0
            },
            title: '',
            msgTip: '',
            serachKey: ''
        };
    },
    computed: {
        ...mapGetters(['user'])
    },
    watch: {
        serachKey() {
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.reset();
                this.submitSearch();
            }, 500);
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        if (!('role' in this.args)) this.args.role = 4;
        this.title = titleMap[this.args.role]['title'];

        this.getData();
    },
    methods: {
        reset() {
            this.pageIndex = 1;
            this.nomore = false;
            this.isFetching = false;
            this.list = [];
            this.isloaded = false;
        },
        toMemberDetail(item) {
            this.$navigate({
                url: '/pages/team/member-detail/member-detail',
                query: {
                    id: item.id
                }
            });
        },
        submitSearch() {
            this.getData(this.serachKey);
        },
        getData(key) {
            if (this.nomore || this.isFetching) return;
            this.isFetching = true;
            this.$http.post(API_ADMIN_PROFIT_LIST, { page: this.pageIndex, size: MAX_SIZE, id: this.user.id, ...key && { key } }).then(data => {
                this.isFetching = false;
                this.isloaded = true;
                const { list } = data;
                if (list.length < MAX_SIZE) this.nomore = true;

                if (this.pageIndex === 1) {
                    this.list = list;
                } else {
                    this.list = this.list.concat(list);
                }
                this.pageIndex++;
            }).catch((erro) => {
                this.isFetching = false;
                this.isloaded = true;
                this.$toast(erro);
            });
        }
    }
};
</script>

<style lang="less" type="text/less" scoped>
    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-hd {
        margin: 24rpx 29rpx 50rpx;
        height: 76rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        position: relative;

        .mask {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: transparent;
        }

        .icon-40 {
            font-size: 34rpx;
            display: inline-block;
            margin: 0 20rpx;
            color: rgba(78, 88, 110, 1);
        }

        input {
            flex: 1;
            background: rgba(37, 43, 54, 1);
            line-height: 40rpx;
            margin-right: 20rpx;
            color: #fff;
            font-size: 26rpx;
        }
    }

    .role-list {
        margin-top: 149rpx;
        flex: 1;
        position: relative;
        &.active {
            margin-top: 0;
        }

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
    }

    .role-list .list {
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 29rpx;
            padding-right: 29rpx;
            position: relative;

            span {
                display: inline-block;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 145rpx;
            }
            span:nth-of-type(1) {
                width: 60rpx;
                text-align: left;
            }
            span:nth-of-type(5) {
                width: 125rpx;
                margin-right: 20rpx;
                text-align: right;
            }

            &:first-child {
                height: 72rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 34rpx;
                background: rgba(17, 21, 29, 1);

                span:nth-of-type(5),
                span:nth-of-type(4) {
                    font-weight: 400;
                    color: rgba(151, 160, 180, 1);
                }
            }

            + li {
                height: 118rpx;
                font-size: 30rpx;
                font-weight: 500;
                color: rgba(151, 160, 180, 1);
                line-height: 42rpx;

                &:active {
                    background-color: rgba(255, 255, 255, 0.2);
                }

                &::after {
                    width: 120%;
                    position: absolute;
                    left: 29rpx;
                    bottom: 0;
                    content: "";
                    height: 1rpx;
                    background-color: rgba(62, 67, 77, 1);
                }

                span:nth-of-type(1) {
                    font-weight: 400;
                    color: rgba(247, 181, 0, 1);
                }
                span:nth-of-type(2) {
                    font-weight: 400;
                    color: rgba(44, 201, 233, 1);
                }
                span:nth-of-type(3) {
                    font-weight: 500;
                    color: rgba(255, 255, 255, 1);
                }
                span:nth-of-type(5),
                span:nth-of-type(4) {
                    font-weight: 500;
                    color: rgba(151, 160, 180, 1);
                }

            }
        }

    }
</style>
