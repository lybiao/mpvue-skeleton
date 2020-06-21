<template>
    <base-page>
        <template slot="header">
            <base-header :title="title" :show-left="true"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="content">
                    <div class="search role-hd">
                        <i class="icon-40"></i>
                        <input type="text">
                    </div>
                    <ul class="itembox">
                        <li class="item" v-for="(item, index) in list" :key="index">
                            <p class="name" :class="{'personnel':args.type=='personnel'}">{{ item.name }} {{ item.phone }}</p>
                            <i class="icon-169" @click.stop="unfreeze(item, index)"></i>
                        </li>
                    </ul>
                </div>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ADMIN_MANAGE_FREEZELIST, API_ADMIN_MANAGE_FREEZE } from '@/api'
const MAX_SIZE = 20;


export default {
    mixins: [PageMixin],
    data() {
        return {
            args: {},
            title: '员工账号',
            list: [],
            pageIndex: 1,
            nomore: false
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
        this.args = Object.assign(this.args, options)
        this.title = this.args.type == 'personnel' ? '员工账号' : '客户账号'

        this.getData()
    },
    methods: {
        getData() {
            if (this.nomore || this.flag) return
            this.flag = true
            this.$http.post(API_ADMIN_MANAGE_FREEZELIST, { page: this.pageIndex, size: MAX_SIZE, type: this.args.type == 'personnel' ? 0 : 1 }).then(data => {
                if (data.list && data.list.length) {
                    this.list = this.list.concat(data.list)
                }
                this.pageIndex++
                this.flag = false
                if (data.list.length < MAX_SIZE) this.nomore = true
            }).catch((error) => {
                this.$toast(error)
                this.flag = false
            })
        },
        unfreeze(item, index) {
            mpvue.showActionSheet({
                itemList: ['解冻账号'],
                success: res => {
                    if (res.tapIndex == 0) {
                        this.$http.post(API_ADMIN_MANAGE_FREEZE, { id: item.id, type: 1 }).then(data => {
                            this.list.splice(index, 1)
                            this.$bus.emit('unfreeze', this.args)
                        }).catch((error) => {
                            this.$toast(error)
                        })
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .role-hd {
        margin: 0 26rpx 51rpx 24rpx;
        height: 65rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 15rpx;
        display: flex;
        align-items: center;
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
            margin-right: 20rpx;
        }
    }

    .content {
        margin-top: 34rpx;
    }

    .itembox {
        padding-left: 34rpx;
    }

    .itembox .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 29rpx;
        color: #F281E1;
        font-size: 26rpx;
        border-bottom: 1rpx solid #3E434D;
        height: 119rpx;
    }

    .itembox .item .name.personnel {
        color: #2CC9E9;
    }

    .itembox .item:first-child {
        border-top: 1rpx solid #3E434D;
    }

    .itembox .item .icon-169 {
        color: #97A0B4;
        padding: 20rpx;
    }
</style>

