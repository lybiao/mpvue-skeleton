<template>
    <base-page>
        <template slot="header">
            <base-header :title="roleType+'('+total+')'" title-class="zero" right-width="60" @right="toMemberAdd" :show-right="showCreatBtn">
                <template slot="right">
                    <div class="hbtn">开通帐号</div>
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
                    <scroll-view class="scroll-view" scroll-y="true" @scrolltolower="getData">
                        <ul class="list">
                            <li>
                                <p>排名</p>
                                <p>{{ roleType }}</p>
                                <p :class="{active: curOrder=='today'}" @click="changeDay('today')">今日业绩</p>
                                <p :class="{active: curOrder=='yesterday'}" @click="changeDay('yesterday')">昨日业绩</p>
                                <p :class="{active: curOrder=='total'}" @click="changeDay('total')">累计</p>
                            </li>
                            <li v-for="(item, index) in list" :key="index" @click="toMemberDetail(item)">
                                <p>{{ index+1 }}</p>
                                <p>{{ item.name }}</p>
                                <p :class="{actived: curOrder=='today'}">{{ item.today }}</p>
                                <p :class="{actived: curOrder=='yesterday'}">{{ item.yesterday }}</p>
                                <p :class="{actived: curOrder=='total'}">{{ item.total }}</p>
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
import { PageMixin } from '@/mixins'
import { API_ADMIN_PROFIT_LIST } from '@/api'
import { mapGetters } from 'vuex'
const MAX_SIZE = 20;


export default {
    mixins: [PageMixin],
    computed: {
        ...mapGetters(['user']),
        showCreatBtn() {
            let gly = this.user.roleenum == '管理员' && this.roleType == '部长'
            let bz = this.user.roleenum == '部长' && this.roleType == '总监'
            let zj = this.user.roleenum == '总监' && this.roleType == '经理'
            return gly || bz || zj
        }
    },
    data() {
        return {
            list: [],
            pageIndex: 1,
            total: 0,
            role: {
                部长: 2,
                总监: 3,
                经理: 4
            },
            roleType: '部长',
            order: {
                today: 1,
                yesterday: 2,
                total: 0
            },
            curOrder: 'today',
            searchName: '',
            args: {},
            nomore: false
        }
    },
    watch: {
        searchName() {
            this.search()
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        switch (this.args.type) {
        case 'minister':
            this.roleType = '部长'
            break
        case 'director':
            this.roleType = '总监'
            break
        case 'manager':
            this.roleType = '经理'
            break
        default:
            this.roleType = '团队'
        }
        this.getData()
    },
    onUnload() {
        this.$bus.off('team-member-add')
    },
    methods: {
        toMemberDetail(item) {
            this.$navigate({
                url: '/pages/team/member-detail',
                query: {
                    id: item.id
                }
            })
        },
        search() {
            if (this.timer) clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.nomore = false
                this.pageIndex = 1
                this.list = []
                this.getData()
            }, 1000)
        },
        getData() {
            if (this.nomore || this.isFetching) return
            this.isFetching = true
            this.$http.post(API_ADMIN_PROFIT_LIST, { orderBy: this.order[this.curOrder], role: this.role[this.roleType], page: this.pageIndex, size: MAX_SIZE, key: this.searchName }).then(data => {
                this.isFetching = false
                const { list } = data
                if (list.length < MAX_SIZE) this.nomore = true
                this.list = this.list.concat(list)
                this.total = data.total
                this.pageIndex++
            }).catch((erro) => {
                this.isFetching = false
                this.$toast(erro)
            })
        },
        changeDay(day) {
            this.curOrder = day
            this.nomore = false
            this.pageIndex = 1
            this.list = []
            this.getData()
        },
        toMemberAdd() {
            this.$bus.on('team-member-add', data => {
                this.list.unshift(data)
            })
            this.$navigate({
                url: '/pages/team/member-add',
                query: {
                    role: this.role[this.roleType]
                }
            })
        },
        clearSearchTxt() {
            this.searchName = ''
            this.search()
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .hbtn {
        width: 170rpx;
        height: 58rpx;
        background:  #252b36;
        border-radius: 25rpx;
        color: #fff;
        font-size: 22rpx;
        text-align: center;
        line-height: 58rpx;
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
            font-size: 34rpx;
            display: inline-block;
            margin: 0 20rpx;
            color: rgba(78, 88, 110, 1);
        }

        input {
            flex: 1;
            background: rgba(37, 43, 54, 1);
            line-height: 76rpx;
            margin-right: 60rpx;
            color: #fff;
            font-size: 30rpx;
        }
        .icon-61 {
            position: absolute;
            width: 50rpx;
            height: 58rpx;
            line-height: 70rpx;
            right: 0;
            top: 0;
            text-align: center;
            font-size: 30rpx;
            color: #4E586E
        }
    }

    .role-list {
        flex: 1;
        position: relative;
        overflow: hidden;
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

            p {
                display: inline-block;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 145rpx;
            }
            p:nth-of-type(1) {
                width: 60rpx;
                text-align: left;
            }
            p:nth-of-type(5) {
                width: 125rpx;
                margin-right: 20rpx;
                text-align: right;
            }

            &:first-child {
                height: 72rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: #97A0B4;
                line-height: 34rpx;
                background: rgba(17, 21, 29, 1);

                p.active {
                    color: #fff;
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

                p:nth-of-type(1) {
                    font-weight: 400;
                    color: rgba(247, 181, 0, 1);
                }
                p:nth-of-type(2) {
                    font-weight: 400;
                    color: rgba(44, 201, 233, 1);
                }
                p:nth-of-type(3) {
                    font-weight: 500;
                    color: rgba(151, 160, 180, 1);
                }
                p:nth-of-type(5),
                p:nth-of-type(4) {
                    font-weight: 500;
                    color: rgba(151, 160, 180, 1);
                }

            }
        }

    }

    .actived {
        color: #fff !important;
        font-weight: 500 !important;
    }
</style>
