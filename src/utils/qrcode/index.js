/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'



import { QRCode, QRErrorCorrectLevel } from './qrcode'


const DEFAULT = {
    render: 'canvas',
    typeNumber: 6,
    background: '#fff',
    width: 100,
    height: 100,
    foreground: '#1A1A1A',
    correctLevel: QRErrorCorrectLevel.L,
    canvasId: 'invitation',
    text: '/pages/login/login'
}


export const drawQRCode = (options = {}) => {
    options = Object.assign(DEFAULT, options)
    if (!options.canvasId || options.canvasId == '') {
        throw new Error('请输入有效的画布 id !')
    }
    const createCanvas = (options) => {
        const qrcode = new QRCode(options.typeNumber, options.correctLevel)
        qrcode.addData(options.text)
        qrcode.make()
        const ctx = mpvue.createCanvasContext(options.canvasId)

        const tileW = options.width / qrcode.getModuleCount()
        const tileH = options.height / qrcode.getModuleCount()
        ctx.save()
        for (let row = 0; row < qrcode.getModuleCount(); row++) {
            for (let col = 0; col < qrcode.getModuleCount(); col++) {
                let style = qrcode.isDark(row, col) ? options.foreground : options.background
                ctx.setFillStyle(style)
                let w = (Math.ceil((col + 1) * tileW) - Math.floor(col * tileW))
                let h = (Math.ceil((row + 1) * tileW) - Math.floor(row * tileW))
                ctx.fillRect(Math.round(col * tileW), Math.round(row * tileH), w, h)
            }
        }
        ctx.restore()
        ctx.draw()
    }
    createCanvas(options)
}
