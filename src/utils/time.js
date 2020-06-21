/**
 *************************************************************
 * @Author: LIANG YAN BIAO
 * @Date:   on 2020/05/25
 * @Last Modified by:   LIANG YAN BIAO
 * @Last Modified time: on 2020/05/25
 *************************************************************
 */
'use strict'



//格式化年月日
export const formatTime = function (date, f) {
    date = String(date)
    if (date.indexOf('-') > -1) {
        date = date.replace(/-/g, '/')
    }
    date = new Date(date)

    function tempfunc(opo, pos) {
        var val = ''
        opo = String(opo)
        for (var a = 1; a < arguments.length; a++) {
            var chr = opo.charAt(arguments[a] - 1)
            val += chr
        }
        return val
    }

    if (!f) f = 'yyyy-MM-dd HH:mm:ss'
    var h12 = date.getHours() > 12 ? (date.getHours() - 12) : date.getHours()
    var week = ['日', '一', '二', '三', '四', '五', '六']
    var tmp = {
        yyyy: date.getFullYear(),
        yy: tempfunc(date.getFullYear(), 3, 4),
        MM: (date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1),
        M: date.getMonth() + 1,
        dd: (date.getDate() < 10 ? '0' : '') + date.getDate(),
        d: date.getDate(),
        hh: (h12 < 10 ? '0' : '') + h12, // 12小时制
        h: h12,
        HH: (date.getHours() < 10 ? '0' : '') + date.getHours(), // 24小时制
        H: date.getHours(),
        mm: (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(),
        m: date.getMinutes(),
        ss: (date.getSeconds() < 10 ? '0' : '') + date.getSeconds(),
        s: date.getSeconds(),
        week: '星期' + week[date.getDay()]
    }

    for (var p in tmp) f = f.replace(new RegExp('\\b' + p + '\\b', 'g'), tmp[p])
    return f
}




export const formatByTime = (value, type) => {
    if (typeof value == 'string') {
        value = new Date(value.replace(/-/g, '/'))
    } else {
        value = new Date(value)
    }
    return formatTime(value, type)
}



//最近时间
export const timespan = (d) => {
    d = d.replace(/-/g, '/')
    var sec = (new Date().getTime() - new Date(d).getTime()) / 1000
    if (sec < 5) return '刚刚'
    if (sec < 60) return Math.floor(sec) + '秒前'
    var min = sec / 60
    if (min < 60) return Math.floor(min) + '分钟前'
    var hou = min / 60
    if (hou < 24) return Math.floor(hou) + '小时前'
    var day = hou / 24
    if (day < 30) return Math.floor(day) + '天前'
    var mon = day / 30
    if (mon < 12) return Math.floor(mon) + '月前'
    return Math.floor(day / 365) + '年前'
}
