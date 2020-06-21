<template>
    <base-page>
        <template slot="header">
            <base-header></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <div class="top">
                    <p class="day">{{ args.shortDate }}收益</p>
                    <p class="money">+{{ args.money }}</p>
                </div>
                <ul class="botom">
                    <li>
                        <span>业绩总额</span>
                        <span>{{ args.performance }}</span>
                    </li>
                    <li>
                        <span>结算比例</span>
                        <span>{{ args.ratio * 100 }}%</span>
                    </li>
                    <li>
                        <span>结算时间</span>
                        <span>{{ args.longDate }}</span>
                    </li>
                </ul>
            </scroll-view>
        </template>
    </base-page>
</template>

<script>


export default {
    data() {
        return {
            args: {}
        }
    },
    onLoad(options) {
        this.args = Object.assign(this.args, options)
        this.args.shortDate = this.$formatTime(+this.args.date, 'M月d日')
        this.args.longDate = this.$formatTime(+this.args.date, 'yyyy-MM-dd HH:mm')
        this.args.performance = `￥${(+this.args.performance).toFixed(2)}`
        this.args.money = `${(+this.args.money).toFixed(2)}`
    }
}
</script>

<style lang="less" type="text/less" scoped>
    .top {
        margin-top: 130rpx;
        margin-bottom: 190rpx;
    }

    .day {
        height: 36rpx;
        font-size: 30rpx;
        font-weight: 400;
        color: rgba(216, 216, 216, 1);
        line-height: 42rpx;
        text-align: center;
    }

    .money {
        height: 76rpx;
        font-size: 76rpx;
        font-weight: 500;
        color: rgba(244, 99, 135, 1);
        line-height: 96rpx;
        text-align: center;
        padding-top: 20rpx;
    }

    .botom {
        margin-left: 29rpx;
        border-top: 1rpx solid rgba(62, 67, 77, 1);

        li {
            height: 60rpx;
            line-height: 60rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 30rpx;
            font-weight: 400;
            color: rgba(255, 255, 255, 1);
            line-height: 42rpx;

            &:first-child {
                margin-top: 40rpx;
            }
        }
        span:first-child {
            padding-right: 46rpx;
        }
    }
</style>
