<template>
    <div class="search-box">
        <div class="searchbar" :style="{marginTop: (menuRect.top + 30) + 'px'}">
            <div class="text">
                <i class="icon-40"></i>
                <input type="text" placeholder="姓名/手机号" v-model.trim="searchName" maxlength="11">
                <em class="icon-61" @click.stop="clearSearchTxt"></em>
            </div>
            <div class="btn" @click.stop="cancel">取消</div>
        </div>
        <div class="wrap">
            <scroll-view class="scroll-view" @scrolltolower="getData" :scroll-y="true">
                <div class="mycardsBoxs" v-if="searchData.length">
                    <div class="items">
                        <div class="itemBox" v-for="(item, index) in searchData" :key="index" @click.stop="toDetail(item)">{{ item.name }}</div>
                    </div>
                </div>
            </scroll-view>
            <div class="serach-content" v-if="!searchData.length">无搜索结果</div>
        </div>
    </div>
</template>

<script>
import { API_ACCOUNT_SEARCH } from '@/api'
import { BaseMixin } from '@/mixins'


export default {
    mixins: [BaseMixin],
    data() {
        return {
            searchName: '',
            searchData: [],
            pageIndex: 1,
            nomore: false
        }
    },
    watch: {
        searchName() {
            clearTimeout(this.t)
            if (this.searchName) {
                this.t = setTimeout(() => {
                    this.nomore = false
                    this.searchData = []
                    this.pageIndex = 1
                    this.getData()
                }, 1000)
            }
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data())
    },
    methods: {
        getData() {
            if (this.nomore || this.loading) return
            let params = {
                key: this.searchName,
                pageIndex: this.pageIndex,
                pageSize: 15
            }
            this.loading = true
            this.$http.post(API_ACCOUNT_SEARCH, params).then(d => {
                this.loading = false
                if (d.info.length != 15) this.nomore = true
                this.searchData = [...this.searchData, ...d.info]
                this.pageIndex++
            }).catch(() => {
                this.loading = false
            })
        },
        clearSearchTxt() {
            this.searchName = ''
        },
        cancel() {
            this.$emit('hide')
        },
        toDetail(item) {
            this.$navigate({
                url: '/pages/checkout/member-detail',
                query: {
                    id: item.id
                }
            })
        }
    }
}
</script>

<style lang="less" type="text/less">
    .search-box {
        height: 100%;
        width: 100%;
        background-color: #141922;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .wrap {
        position: relative;
        z-index: 1;
        flex: 1;
        overflow: hidden;
    }

    .searchbar {
        display: flex;
        padding: 40rpx 29rpx 15rpx 26rpx;
        width: 100%;
        box-sizing: border-box;
    }

    .searchbar .text {
        background-color: #252b36;
        flex: 1;
        border-radius: 18rpx;
        transition: background 0.6s;
        position: relative;
        display: flex;
    }

    .searchbar .text i {
        font-size: 34rpx;
        margin: 0 10rpx;
        display: inline-flex;
        align-items: center;
        color: #4e586e;
        font-weight: bold;
    }

    .searchbar .text em {
        position: absolute;
        width: 50rpx;
        height: 58rpx;
        line-height: 76rpx;
        right: 0;
        top: 0;
        text-align: center;
        font-size: 34rpx;
        color: #4e586e;
    }

    .searchbar input {
        height: 76rpx;
        vertical-align: middle;
        border: none;
        font-size: 34rpx;
        width: 80%;
        background: inherit;
        color: #f46387;
    }

    .searchbar .btn {
        height: 76rpx;
        line-height: 76rpx;
        padding: 0 30rpx 0 30rpx;
        color: #81899c;
        font-size: 32rpx;
        background-color: #252b36;
        margin-left: 12rpx;
        border-radius: 18rpx;
    }

    .mycardsBoxs {
        font-size: 0;
        line-height: 0;
        height: 100%;
        background-color: #141922 !important;
    }

    .mycardsBoxs .items {
        padding: 65rpx 0 0rpx;
    }

    .mycardsBoxs .itemBox {
        height: 121rpx;
        color: #fff;
        font-size: 32rpx;
        margin-left: 34rpx;
        border-bottom: 1rpx solid #3e434d;
        line-height: 120rpx;
    }

    .mycardsBoxs .itemBox:first-child {
        border-top: 1rpx solid #3e434d;
    }

    .serach-content {
        position: absolute;
        top: -88rpx;
        left: 0rpx;
        bottom: 0rpx;
        right: 0rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        color: #818181;
    }

</style>


