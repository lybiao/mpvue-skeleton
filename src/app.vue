<script>
import { SET_SYSTEM_INFO, SET_MENU_BTN_RECT } from '@/store/global'
import store from '@/store'

export default {
    onLaunch() {
        this.launchInit()
    },
    onPageNotFound(res) {
        this.$redirect({
            url: '/pages/start/start'
        })
    },
    methods: {
        launchInit() {
            store.dispatch(SET_SYSTEM_INFO)

            store.dispatch(SET_MENU_BTN_RECT).catch(() => {
                mpvue.showModal({
                    title: '提示',
                    showCancel: false,
                    content: '当前微信版本过低，为了更好体验，建议升级到最新微信版本后重试。'
                })
            })
            this.invokeUpdateManager()
        },
        invokeUpdateManager() {
            return new Promise((resolve, reject) => {
                if (!mpvue.getUpdateManager) return false
                const updateManager = mpvue.getUpdateManager()
                updateManager.onCheckForUpdate(function (res) {
                })
                updateManager.onUpdateReady(function () {
                    mpvue.showModal({
                        title: '更新提示',
                        content: '新版本已经准备好，请重启应用',
                        cancelText: '忽略',
                        confirmText: '重启',
                        success: function (res) {
                            if (res.confrim) {
                                updateManager.applyUpdate()
                                resolve()
                            } else {
                                reject('忽略更新')
                            }
                        }
                    })
                })
                updateManager.onUpdateFailed(function () {
                    reject('下载失败')
                })
            })
        }
    }
}
</script>

<style lang="less" type="text/less">
@import "./styles/index.less";
</style>


