<template>
    <div class="base-hd-wrap" :style="wrap" :class="[color]">
        <div class="base-hb-box" :style="box">
            <slot name="left">
                <div class="base-left" :class="['base-left-'+leftType,leftClass]" @click.stop="click('left')" v-if="hasShowLeft">
                    <i class="icon-28" v-if="leftType==='back'" key="返回"></i>
                    <i class="icon-29" v-if="leftType==='close'" key="关闭"></i>
                    <i class="icon-32" v-if="leftType==='exit'" key="退出"></i>
                </div>
            </slot>
            <div class="base-middle" :class="[titleClass, !hasShowLeft ? 'base-middle-center' : '']" @click.stop="click('title')">
                <slot name="title">{{ title }}</slot>
            </div>
            <div class="base-right" :class="[rightClass]" @click.stop="click('right')" :style="{width: rightWidth + 'px'}" v-if="showRight">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { BaseMixin } from '@/mixins'
import { mapGetters } from 'vuex'

export default {
    mixins: [BaseMixin],
    props: {
        color: {
            type: String,
            default: ''
        },
        scrollTop: {
            type: Number,
            default: 0
        },
        showLeft: {
            type: Boolean,
            default: true
        },
        showRight: {
            type: Boolean,
            default: true
        },
        leftType: {
            type: String,
            default: 'back'
        },
        leftClass: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        titleClass: {
            type: String,
            default: ''
        },
        rightClass: {
            type: String,
            default: ''
        },
        rightWidth: {
            type: Number,
            default: 30
        },
        customReturn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isNext: false
        }
    },
    computed: {
        ...mapGetters(['user']),
        box() {
            const width = this.menuRect.right - this.menuRect.width
            return `top:${this.menuRect.top}px;width:${width}px;`
        },
        wrap() {
            if (this.color) {
                return `height:${this.iphoneX ? this.navTop.iphoneX : this.navTop.common}px;`
            }
            return `height:${this.iphoneX ? this.navTop.iphoneX : this.navTop.common}px;background-color:rgba(255,255,255,${this.scrollTop})`
        },
        hasShowLeft() {
            return this.leftType === 'exit' || this.isNext && this.showLeft
        }
    },
    onLoad() {
        this.isNext = getCurrentPages().length > 1
    },
    methods: {
        click(type) {
            if (type === 'left' && !this.customReturn) {
                this.back()
                return false
            }
            this.$emit(type)
        }
    }
}
</script>


<style lang="less" type="text/less">
    .base-hd-wrap {
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 999;
        box-sizing: border-box;
        overflow: hidden;
        color: #fff;

        &.border-bottom {
            border: 0.5px solid #E6E6E6;
        }

        .base-hb-box {
            height: 32px;
            display: flex;
            align-items: center;

            position: absolute;
            left: 0;
        }
        .base-left {
            width: 30px;
            height: 30px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            z-index: 1000;
            border: 0.5px solid rgba(0, 0, 0, 0.1);
            border-radius: 100%;
            margin-left: 10px;
            background-color: transparent;
            &.no-border {
                border: 0;
            }

            &.base-left-close {
                i {
                    font-size: 18px;
                    padding-right: 0;
                }
            }

            &.base-left-back {
                i {
                    font-size: 20px;
                    padding-right: 3px;
                    padding-bottom: 2px;
                }
            }

            &.base-left-exit {
                margin-left: 0;
                .icon-32 {
                    font-size: 46rpx;
                    padding-left: 30rpx;
                }
            }

            &.transparent {
                background-color: rgba(0, 0, 0, 0.2);
            }

            &.hover {
                opacity: 0.6;
            }

        }

        .base-middle {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            z-index: 1000;
            position: relative;


            margin-left: 57px;
            &.base-middle-center{
                margin-left: 87px;
            }

            &.zero{
                margin-left: 0;
            }
        }

        .base-right {
            height: 30px;
            position: absolute;
            top: 50%;
            right: 5px;
            transform: translate(0, -50%);
            z-index: 1002;
            display: flex;
            align-items: center;
            justify-content: center;

            &.has-border {
                border-radius: 50%;
                border: 0.5px solid rgba(0, 0, 0, 0.1);
            }

            .bgauto {
                display: inline-block;
                width: 53rpx;
                height: 53rpx;
                background-color: #eee;
                border-radius: 50%;
            }

        }
    }
</style>
