<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true" :title="guser.name+'的团队'+'('+total+')'"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap">
                <div class="top">
                    <div class="hbtn" @click="toMemberAdd" v-if="showAddBtn">添加团队</div>
                    <div class="search role-hd">
                        <i class="icon-40"></i>
                        <input type="text" v-model.trim="searchName" placeholder="姓名/手机号">
                        <em class="icon-61" @click.stop="clearSearchTxt"></em>
                    </div>
                </div>
                <div class="role-list">
                    <scroll-view class="scroll-view" :scroll-y="true">
                        <ul class="list" :class="curOrder">
                            <li>
                                <p>排名</p>
                                <p v-if="guser.role_id == 2 ">总监</p>
                                <p v-else>经理</p>
                                <p @click="changeDay('today')">今日</p>
                                <p @click="changeDay('yesterday')">昨日</p>
                                <p @click="changeDay('total')">累计</p>
                            </li>
                            <li v-for="(item, index) in list" :key="index" @click="toMemberDetail(item)">
                                <p>{{ index+1 }}</p>
                                <p><i class="imgsd bgauto" :style="item.img_face ? 'background-image:url(' + item.img_face +')' :''"></i> {{ item.name }}</p>
                                <p>{{ item.today }}</p>
                                <p>{{ item.yesterday }}</p>
                                <p>{{ item.total }}</p>
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
import { PageMixin } from '@/mixins'
import { API_ADMIN_PROFIT_LIST } from '@/api'
import { mapGetters } from 'vuex'
const MAX_SIZE = 20;


export default {
    mixins: [PageMixin],
    data() {
        return {
            list: [],
            pageIndex: 1,
            total: 0,
            guser: {},
            isloaded: false,
            showAddBtn: false,
            order: {
                today: 1,
                yesterday: 2,
                total: 0
            },
            curOrder: 'today',
            searchName: '',
            args: {}
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.resetData()
        this.getData()
    },
    onUnload() {
        this.$bus.off('team-member-add')
    },
    watch: {
        searchName() {
            this.search()
        }
    },
    methods: {
        resetData() {
            this.nomore = false
            this.pageIndex = 1
            this.list = []
        },
        toMemberDetail(item) {
            this.$navigate({
                url: '/pages/team/member-detail',
                query: {
                    id: item.id
                }
            })
        },
        search() {
            if (this.searchTime) clearTimeout(this.searchTime)
            this.searchTime = setTimeout(() => {
                this.resetData()
                this.getData(this.searchName)
            }, 1000)
        },
        changeDay(day) {
            this.curOrder = day
            this.resetData()
            this.getData()
        },
        // 添加团队成员
        toMemberAdd() {
            this.$bus.on('team-member-add', (data) => {
                this.list.unshift(data)
            })

            this.$navigate({
                url: '/pages/team/member-add',
                query: {
                    role: this.guser.role_id + 1
                }
            })
        },
        getData(searchName) {
            if (this.nomore || this.isFetching) return
            this.isFetching = true
            this.$http.post(API_ADMIN_PROFIT_LIST, {
                orderBy: this.order[this.curOrder],
                role: this.guser.role_id + 1,
                id: this.args.id,
                page: this.pageIndex,
                size: MAX_SIZE,
                ...searchName && { key: searchName }
            }, { loading: this.pageIndex > 1 }).then(data => {
                this.isFetching = false
                this.isloaded = true
                const { list } = data
                if (list.length < MAX_SIZE) this.nomore = true

                if (this.pageIndex === 1) {
                    this.list = list
                    this.guser = data.user
                    this.total = data.total
                    this.showAddBtn = this.user.roleenum != '管理员'
                } else {
                    this.list = this.list.concat(list)
                }
                this.pageIndex++
            }).catch((erro) => {
                this.isFetching = false
                this.isloaded = true
                this.$toast(erro)
            })
        },
        clearSearchTxt() {
            this.searchName = ''
            this.search()
        }
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .hbtn {
        height: 70rpx;
        margin: 29rpx;
        background:  #252b36;
        border-radius: 25rpx;
        color: #fff;
        font-size: 26rpx;
        text-align: center;
        line-height: 70rpx;
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
            line-height: 65rpx;
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
            padding-left: 29rpx;
            padding-right: 29rpx;
            position: relative;

            .imgsd {
                width: 40rpx;
                height: 40rpx;
                border-radius: 100%;
                display: inline-block;
                vertical-align: middle;
            }

            .imgsd:after {
                background-color: rgba(255, 255, 255, 0.05);
            }

            p {
                display: inline-block;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                flex: 1;
            }
            p:nth-of-type(1) {
                width: 60rpx;
                flex: unset;
                text-align: left;
            }
            p:nth-of-type(2) {
                flex: unset;
                width: 160rpx;
                text-align: left;
                text-overflow: ellipsis;
            }
            p:nth-of-type(5) {
                text-align: right;
            }

            &:first-child {
                height: 72rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: rgba(151, 160, 180, 1);
                line-height: 34rpx;
                background: rgba(17, 21, 29, 1);
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
            }
        }
        &.today li p:nth-child(3),
        &.yesterday li p:nth-child(4),
        &.total li p:nth-child(5) {
            color: rgba(255, 255, 255, 1);
        }
    }
</style>
