<template>
    <base-page>
        <template slot="header">
            <base-header title="请选择归属团队" :right-width="50" title-class="zero" @right="saveData" :show-right="curIndex > -1">
                <template slot="right">
                    <div class="hbtn">确定</div>
                </template>
            </base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="search role-hd">
                    <i class="icon-40"></i>
                    <input type="text" v-model.trim="searchName" placeholder="姓名/手机号">
                    <em class="icon-61" @click.stop="clearSearchTxt"></em>
                </div>
                <div class="role-list">
                    <scroll-view @scrolltolower="getData" class="scroll-view" :scroll-y="true">
                        <ul class="list">
                            <li v-for="(item, index) in list" :class="{active: curIndex == index}" @click="curIndex=index" :key="index" v-if="args.info.id != item.id">
                                <i></i>
                                <p>{{ item.name }}</p>
                            </li>
                        </ul>
                    </scroll-view>
                    <template v-if="!list.length">
                        <div class="tip">暂时没有团队成员</div>
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


export default {
    computed: {
        ...mapGetters(['user'])
    },
    data() {
        return {
            args: {
                info: {}
            },
            list: [],
            pageIndex: 1,
            role: {
                部长: 1,
                总监: 2,
                经理: 3
            },
            roleType: '部长',
            searchName: '',
            curIndex: -1
        };
    },
    watch: {
        searchName() {
            this.search();
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
        this.roleType = this.args.roleenum;
        this.getData();
    },
    onUnload() {
        this.$bus.off('choose-team');
    },
    methods: {
        search() {
            if (this.searchTime) clearTimeout(this.searchTime);
            this.searchTime = setTimeout(() => {
                this.nomore = false;
                this.pageIndex = 1;
                this.list = [];
                this.getData();
            }, 1000);
        },
        getData() {
            if (this.nomore || this.isFetching) return;
            this.isFetching = true;
            this.$http.post(API_ADMIN_PROFIT_LIST, {
                id: this.user.roleenum == '管理员' ? undefined : this.user.id,
                orderBy: 2,
                role: this.role[this.roleType],
                page: this.pageIndex,
                size: MAX_SIZE,
                key: this.searchName
            }).then(data => {
                this.isFetching = false;
                const { list } = data;
                if (list.length < MAX_SIZE) this.nomore = true;
                this.list = this.list.concat(list);
                this.pageIndex++;
            }).catch((erro) => {
                this.isFetching = false;
                this.$toast(erro);
            });
        },
        saveData() {
            this.$bus.emit('choose-team', this.list[this.curIndex]);
            this.back();
        },
        changeDay() {
            this.nomore = false;
            this.pageIndex = 1;
            this.list = [];
            this.getData();
        },
        clearSearchTxt() {
            this.searchName = '';
            this.search();
        }
    }
};
</script>

<style lang="less" type="text/less" scoped>

    .hbtn {
        width: 100rpx;
        height: 49rpx;
        background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
        border-radius: 25rpx;
        color: #fff;
        font-size: 20rpx;
        text-align: center;
        line-height: 49rpx;
    }

    .role-wrap {
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .role-hd {
        margin: 24rpx 29rpx 50rpx;
        height: 65rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 15rpx;
        display: flex;
        align-items: center;
        position: relative;

        .icon-40 {
            font-size: 30rpx;
            display: inline-block;
            margin: 0 20rpx;
            color: rgba(78, 88, 110, 1);
        }

        input {
            flex: 1;
            background: rgba(37, 43, 54, 1);
            line-height: 40rpx;
            margin-right: 60rpx;
            color: #fff;
            font-size: 26rpx;
        }
        .icon-61 {
            position: absolute;
            width: 50rpx;
            height: 58rpx;
            line-height: 58rpx;
            right: 0;
            top: 0;
            text-align: center;
            font-size: 29rpx;
            color: #4E586E
        }
    }

    .role-list {
        flex: 1;
        position: relative;
        overflow: hidden;

        .tip {
            font-size: 26rpx;
            font-weight: 400;
            color: rgba(110, 116, 129, 1);
            line-height: 36rpx;
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
            padding: 0 30rpx;
            position: relative;
            height: 118rpx;
            font-size: 26rpx;
            font-weight: 500;
            color: rgba(151, 160, 180, 1);
            line-height: 32rpx;

            &.active {
                background-color: rgba(255, 255, 255, 0.2);
            }

            i {
                width: 36rpx;
                height: 36rpx;
                border: 2rpx solid rgba(121, 121, 121, 1);
                border-radius: 100%;
                text-align: center;
                line-height: 38rpx;
                color: #fff;
            }

            &.active i {
                width: 40rpx;
                height: 40rpx;
                background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
                border: none;
            }

            &.active i:after {
                content: "\e907";
                font-family: 'icomoon' !important;
            }

            p {
                flex: 1;
                padding-left: 20rpx;
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

        }

    }
</style>
