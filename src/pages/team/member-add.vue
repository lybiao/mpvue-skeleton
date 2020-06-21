<template>
    <base-page>
        <template slot="header">
            <base-header title="添加团队成员"></base-header>
        </template>
        <template slot="main">
            <scroll-view class="scroll-view" :scroll-y="true">
                <ul class="add-box">
                    <li>
                        <p class="phone" :class="{active: field.phone.length}" @click.stop="showKeyboard=true" maxlength="11">{{ field.phone.length ? field.phone :"请输入对方手机号" }}</p>
                    </li>
                    <li class="name" v-if="isPass">
                        <input type="text" :class="{active: field.name.length}" maxlength="20" placeholder="请输入对方姓名" v-model="field.name" @focus="showKeyboard=false">
                    </li>
                    <li v-if="isPass">
                        <div class="btn" :class="{active: isPass&& field.name.length}" @click.stop="submitAdd">确定</div>
                    </li>
                </ul>
            </scroll-view>
        </template>
        <template slot="export">
            <Keyboard v-if="showKeyboard" :phone-num="true" @checkNum="checkNum" @removeNum="removeNum" />
        </template>
    </base-page>
</template>

<script>
import { isPhone } from '@/utils';
import { API_ADMIN_ADD } from '@/api';
import Keyboard from '@/pages/components/keyboard';


export default {
    components: {
        Keyboard
    },
    data() {
        return {
            field: {
                name: '',
                phone: ''
            },
            args: {},
            showKeyboard: true
        };
    },
    computed: {
        isPass() {
            return isPhone.test(this.field.phone);
        }
    },
    onLoad(options) {
        Object.assign(this.$data, this.$options.data());
        this.args = Object.assign(this.args, options);
    },
    onUnload() {
        this.$bus.off('team-member-add');
    },
    methods: {
        isCheck() {
            if (!this.field.phone.length) {
                return {
                    msg: '请输入对方手机号',
                    isPass: false
                };
            } else {
                if (!this.isPass) {
                    return {
                        msg: '请输入正确手机号',
                        isPass: false
                    };
                }
            }
            if (!this.field.name.length) {
                return {
                    msg: '请输入对方姓名',
                    isPass: false
                };
            }

            return {
                isPass: true,
                msg: '通过'
            };
        },
        removeNum() {
            this.field.phone = this.field.phone.slice(0, -1);
        },
        checkNum(text) {
            if (this.field.phone.length >= 11) return false;
            this.field.phone = this.field.phone.concat(text);
        },
        submitAdd() {
            const result = this.isCheck();
            if (!result.isPass) {
                this.$toast(result.msg);
                return false;
            }
            if (this.isFetching) return;
            this.isFetching = true;
            this.$http.post(API_ADMIN_ADD, { ...this.field, role: this.args.role }).then(res => {
                this.isFetching = false;
                this.$bus.emit('team-member-add', { ...this.field, id: res.id, today: 0, yesterday: 0, total: 0 });
                this.$redirect({
                    url: '/pages/team/member-add-success'
                });
            }).catch((erro) => {
                this.isFetching = false;
                this.$toast(erro);
            });
        }
    }
};
</script>

<style lang="less" type="text/less" scoped>
    .btn {
        width: 340rpx;
        height: 70rpx;
        border-radius: 35rpx;
        font-size: 28rpx;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        display: flex;
        align-items: center;
        justify-content: center;
        background: #aaa;

        &.active {
            background: rgba(246, 83, 100, 1);
        }
    }

    .add-box {
        margin-top: 290rpx;

        li {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48rpx;
            line-height: 66rpx;

            &:last-child {
                margin-top: 40px;
            }
        }
        .phone {
            font-weight: 400;
            color: rgba(111, 114, 125, 1);
            padding-bottom: 30rpx;

            &.active {
                font-size: 64rpx;
                line-height: 80rpx;
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }
        }

        input {
            display: inline-block;
            width: 374rpx;
            line-height: 60rpx;
            padding-bottom: 10rpx;
            background: rgba(20, 25, 34, 1);
            border-bottom: 2rpx solid #979797;
            padding-left: 20rpx;
            text-align: center;

            &.active {
                font-weight: 500;
                color: rgba(255, 255, 255, 1);
            }
        }

        .input-placeholder {
            color: rgba(111, 114, 125, 1);
        }
    }


</style>
