<template>
    <base-page>
        <base-header slot="header" :title="args.title" :show-left="false"></base-header>
        <template slot="main">
            <div class="content" v-if="args.info && args.info.create_time">
                <i class="icon-139" :class="{'bgcolor':args.title==='消费扣款'}"></i>
                <p class="text">{{ args.title === '会员充值'?'充值成功':'扣款成功' }}!</p>
                <p class="over">余额: {{ args.info.wealth }}</p>

                <div class="info">
                    <p>当前状态<i>{{ args.title === '会员充值'?'充值':'扣款' }}成功</i></p>
                    <p>{{ args.title === '会员充值'?'充值':'扣款' }}帐号<i>{{ args.info.phone }}</i></p>
                    <p>{{ args.title === '会员充值'?'充值':'扣款' }}时间<i>{{ args.info.create_time }}</i></p>
                    <p>交易单号<i>{{ args.info.transaction_id }}</i></p>
                </div>
            </div>
        </template>
        <template slot="export">
            <div class="button" :class="{'fscolor':args.title==='消费扣款'}" @click.stop="back(-3)">完成</div>
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
        Object.assign(this.$data, this.$options.data())
        if(options.info) {
            options.info = JSON.parse(options.info)
            options.info.create_time = this.$formatTime(options.info.create_time, 'yyyy-MM-dd HH:mm:ss')
        }
        this.args = Object.assign(this.args, options)
    }
}
</script>

<style scoped lang="less" type="text/less">
    .content {
        color: #fff;
        text-align: center;
    }

    .content .icon-139 {
        display: inline-block;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
        text-align: center;
        line-height: 100rpx;
        font-size: 72rpx;
        color: #141922;
        margin: 131rpx 0 41rpx;
    }

    .content .icon-139.bgcolor {
        background: linear-gradient(135deg, rgba(45, 201, 235, 1) 0%, rgba(20, 210, 184, 1) 100%);
    }

    .content .text {
        font-size: 44rpx;
        color: #C7D2EC;
        line-height: 60rpx;
        text-align: center;
    }

    .content .money {
        font-size: 82rpx;
        line-height: 102rpx;
        color: #F46387;
        font-weight: 700;
        margin: 109rpx 0 26rpx;
    }

    .content .money.fscolor, .button.fscolor {
        color: #25CCDA;
    }

    .content .over {
        font-size: 32rpx;
        line-height: 44rpx;
        color: #97A0B4;
        margin-top: 15rpx;
    }

    .content .info {
        border-top: 1rpx solid #3E434D;
        margin: 110rpx 36rpx 0;
        text-align: left;
        padding-top: 42rpx;
        font-size: 30rpx;
        color: #97A0B4;
        line-height: 2;
    }

    .content .info i {
        color: #fff;
        padding-left: 46rpx;
    }

    .button {
        width: 542rpx;
        height: 100rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 50rpx;
        line-height: 100rpx;
        font-size: 34rpx;
        color: #F65364;
        margin: 0 auto;
        margin-bottom: 119rpx;
        border: none;
    }
</style>
