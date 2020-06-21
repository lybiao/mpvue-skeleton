<template>
    <base-page>
        <template slot="header">
            <base-header title="账号管理" :show-left="true"></base-header>
        </template>
        <template slot="main">
            <div class="content">
                <dl>
                    <dt>系统账号</dt>
                    <dd v-for="item in list" @click="toManagerPhone(item)" :key="item.id">
                        <p>{{ item.role }}账号</p>
                        <p v-if="item.phone">{{ item.phone }}</p>
                        <p v-else>未设置</p>
                    </dd>
                </dl>
                <dl>
                    <dt>已冻结账号</dt>
                    <dd @click.stop="toNumber('personnel')">
                        <p>员工账号</p>
                        <p>{{ staffcount }}</p>
                    </dd>
                    <dd @click.stop="toNumber('clientele')">
                        <p>客户账号</p>
                        <p>{{ customcount }}</p>
                    </dd>
                </dl>
            </div>
        </template>
    </base-page>
</template>

<script>
import { PageMixin } from '@/mixins'
import { API_ADMIN_MANAGE_LIST, API_ADMIN_MANAGE_FREEZELIST } from '@/api'


export default {
    mixins: [PageMixin],
    data() {
        return {
            list: [{ role: '前台', phone: '' }, { role: '收银台', phone: '' }],
            staffcount: 0,
            customcount: 0,
            isShowPhoneboard: false
        }
    },
    onLoad() {
        this.getData()
        this.$bus.on('phone', data => {
            let role = data.role == 5 ? '收银台' : '前台'
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i].role == role) this.list[i].phone = data.phone
            }
        })
        this.$bus.on('unfreeze', data => {
            data.type == 'personnel' ? this.staffcount-- : this.customcount--
        })
    },
    onUnload() {
        this.$bus.off('phone')
        this.$bus.off('unfreeze')
    },
    methods: {
        getData() {
            this.$http.post(API_ADMIN_MANAGE_LIST).then(data => {
                switch (data.list.length) {
                case 1:
                    this.list.forEach((item, index) => {
                        if (item.role == data.list[0].role) {
                            item.phone = data.list[0].phone
                        }
                    })
                    break
                case 2:
                    this.list = data.list
                    break
                }
            }).catch(error => {
                this.$toast(error)
            })

            this.$http.post(API_ADMIN_MANAGE_FREEZELIST, { page: 1, size: 1 }).then(data => {
                this.customcount = data.customcount
                this.staffcount = data.staffcount
            }).catch(error => {
                this.$toast(error)
            })
        },
        toManagerPhone(item) {
            this.curItem = item
            let type = this.curItem.role == '收银台' ? 5 : 1
            this.$navigate({
                url: '/pages/manager/phone',
                query: { role: type }
            })
        },
        toNumber(text) {
            this.$navigate({
                url: '/pages/manager/number',
                query: {
                    type: text
                }
            })
        }
    }
}
</script>

<style scoped lang="less" type="text/less">
    .headerbg {
        background-color: transparent;
        color: #fff;
    }

    .content {
        padding-left: 36rpx;
    }

    .content dt {
        font-size: 28rpx;
        color: #ababab;
        line-height: 40rpx;
        border-bottom: 1rpx solid #3e434d;
        padding-bottom: 17rpx;
        margin-top: 94rpx;
    }

    .content dd {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 109rpx;
        border-bottom: 1rpx solid #3e434d;
        padding-right: 38rpx;
        font-size: 30rpx;
        color: #fff;
    }

    .content dd p:first-child {
        width: 300rpx;
    }

    .content dd p:last-child {
        color: #747c8d;
        flex: 1;
        text-align: right;
        font-weight: bold;
    }

    .content dd:after {
        content: "\e900";
        font-family: icomoon !important;
        font-size: 21rpx;
        color: #97a0b4;
        line-height: 1;
        margin-left: 24rpx;
    }
</style>
