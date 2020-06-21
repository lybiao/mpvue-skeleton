/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'


const Koa = require('koa')
const app = new Koa()
const path = require('path')
const staticMiddleware = require('koa-static')
const proxyMiddleware = require('koa-server-http-proxy')
const loggerMiddleware = require('koa-logger')
const route = require('koa-route')
const cors = require('@koa/cors')
const PORT = 3008
const mock = require('./mock')
const LOCAL_BASE_URI = 'http://localhost:3008' //真机调试换成自己的电脑的ip即可

const proxyTable = [
    {
        url: '/api/',
        target: LOCAL_BASE_URI,
        changeOrigin: true,
        secure: true
    }
]

mock.forEach(item => {
    app.use(
        route[item.method](item.url, function (ctx) {
            ctx.body = item.data
        })
    )
})

proxyTable.map(table => {
    app.use(proxyMiddleware(table.url, table))
})

app.use(staticMiddleware(path.resolve(__dirname, './public')))
app.use(loggerMiddleware())
app.use(cors())

//监听端口
app.listen(PORT, () => {
    console.log(`====== 监测端口服务启动：${PORT}`)
})
