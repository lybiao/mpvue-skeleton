<template>
    <div class="base-page-wrap" :class="[color,iphoneX?'iphoneX':'']">
        <div class="the-place-wrap" :class="{iphoneX:iphoneX}" :style="iphoneX?'height:' + navTop.iphoneX + 'px;' : 'height:' + navTop.common + 'px;' " v-if="showPlace"></div>
        <slot name="header"></slot>
        <div class="main">
            <slot name="main"></slot>
        </div>
        <slot name="footer"></slot>
        <slot name="export"></slot>
    </div>
</template>

<script>
import { BaseMixin } from '@/mixins'

export default {
    mixins: [BaseMixin],
    props: {
        color: {
            type: String,
            default: ''
        },
        showPlace: {
            type: Boolean,
            default: true
        }
    },
    onLoad() {
        mpvue.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#ffffff'
        })
    }
}
</script>


<style lang="less" type="text/less">
    .base-page-wrap {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #141922;


        &.white {
            background-color: #fff;
        }

        &.black {
            background-color: #000
        }

        .main {
            position: relative;
            z-index: 1;
            flex: 1;
            overflow: hidden;
        }
    }
     .the-place-wrap {
        width: 100%;
        background-color: rgba(255,255,255,0);
    }
</style>
