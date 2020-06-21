<template>
    <base-page>
        <template slot="main">
            <p><i class="icon-139"></i></p>
            <p>成员添加成功</p>
        </template>
        <template slot="footer">
            <div class="back" @click="back">完成</div>
        </template>
    </base-page>
</template>

<script>
export default {
    data() {
        return {};
    }
};
</script>

<style lang="less" type="text/less" scoped>
    p {
        font-size: 44rpx;
        font-weight: 400;
        color: rgba(199, 210, 236, 1);
        line-height: 68rpx;
        text-align: center;

        &:first-child {
            margin-top: 400rpx;
            margin-bottom: 46rpx;
        }

        .icon-139 {
            display: inline-block;
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            background: linear-gradient(220deg, rgba(247, 131, 97, 1) 0%, rgba(245, 75, 100, 1) 100%);
            text-align: center;
            line-height: 100rpx;
            font-size: 72rpx;
            color: #141922;
        }
    }

    .back {
        width: 542rpx;
        height: 100rpx;
        line-height: 100rpx;
        background: rgba(37, 43, 54, 1);
        border-radius: 52rpx;
        margin: 0 auto 119rpx;
        text-align: center;
        font-size: 34rpx;
        font-weight: 500;
        color: rgba(246, 83, 100, 1);
    }

</style>
