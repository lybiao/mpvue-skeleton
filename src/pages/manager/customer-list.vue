<template>
    <base-page>
        <template slot="header">
            <base-header :show-left="true" :title="'TA的客户('+list.length+')'"></base-header>
        </template>
        <template slot="main">
            <div class="role-wrap" v-if="roleType==='minister'">
                <div class="search role-hd">
                    <i class="icon-40"></i>
                    <input type="text" v-model.trim="searchName" placeholder="姓名/手机号">
                    <em class="icon-61" @click.stop="clearSearchTxt"></em>
                </div>
                <div class="role-list" :class="{active: roleType==='minister'}">
                    <scroll-view class="scroll-view" :scroll-y="true" @scrolltolower="getData">
                        <ul class="list">
                            <li>
                                <span class="col">客户</span>
                                <span class="col">消费次数</span>
                                <span class="col">累计消费</span>
                            </li>
                            <li v-for="(item,index) in list" :key="index">
                                <span class="col">{{ item.name }}</span>
                                <span class="col">{{ item.consume_count }}</span>
                                <span class="col">{{ item.consume_wealth }}</span>
                            </li>
                        </ul>
                    </scroll-view>
                    <template v-if="!list.length">
                        <div class="tip" v-if="isloaded">暂时没有拓展客户</div>
                        <div class="tip" v-if="!list.length && pageIndex===1 && !isloaded">加载中...</div>
                    </template>
                </div>
            </div>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ADMIN_PROFIT_CUSLIST } from '@/api'


const MAX_SIZE = 20
export default {
    mixins: [PageMixin],
    data() {
        return {
            list: [],
            pageIndex: 1,
            nomore: false,
            isFetching: false,
            total: 89,
            args: {},
            isloaded: false,
            roleType: 'minister',
            searchName: ''
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
        this.getData()
    },
    methods: {
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
            this.$http.post(API_ADMIN_PROFIT_CUSLIST, { pageIndex: this.pageIndex, pageSize: MAX_SIZE, key: this.searchName, id: this.args.id }).then(data => {
                this.isFetching = false
                this.isloaded = true
                const { list } = data
                if (list.length < MAX_SIZE) this.nomore = true

                if (this.pageIndex === 1) {
                    this.list = list
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
    .rolehd {
        background-color: transparent;
        color: #fff;
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
        height: 76rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 18rpx;
        display: flex;
        align-items: center;
        position: relative;

        .icon-61 {
            position: absolute;
            width: 50rpx;
            height: 58rpx;
            line-height: 76rpx;
            right: 0;
            top: 0;
            text-align: center;
            font-size: 34rpx;
            color: #4E586E
        }

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
            font-size: 30rpx;
        }
    }

    .role-list {
        /*部长，团队有搜索*/
        margin-top: 149rpx;
        flex: 1;
        position: relative;
        overflow: hidden;
        &.active {
            margin-top: 0;
        }

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
            padding-left: 29rpx;
            padding-right: 29rpx;
            position: relative;

            span {
                display: inline-block;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 33%;
            }
            span:nth-of-type(1) {
                text-align: left;
            }
            &:first-child {
                height: 72rpx;
                font-size: 24rpx;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
                line-height: 34rpx;
                background: rgba(17, 21, 29, 1);

                span:nth-of-type(3),
                span:nth-of-type(4) {
                    font-weight: 400;
                    color: rgba(151, 160, 180, 1);
                    margin-left: 85rpx;
                }
                span:nth-of-type(2) {
                    margin-left: 20rpx;
                }
            }

            + li {
                height: 118rpx;
                font-size: 30rpx;
                font-weight: 500;
                color: rgba(151, 160, 180, 1);
                line-height: 42rpx;

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
                    color: rgba(242, 129, 225, 1);
                    font-weight: 400;
                    margin-left: 20rpx;
                }
                span:nth-of-type(3),
                span:nth-of-type(4) {
                    font-weight: 500;
                    color: rgba(151, 160, 180, 1);
                    margin-left: 85rpx;
                }

            }
        }

    }
</style>
