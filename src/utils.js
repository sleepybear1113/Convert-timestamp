/**
 * 时间戳转字符串
 * @param timestamp 10/13 位时间戳
 * @param type 转换类型
 * @returns {string} 可视化时间字符串
 */
function getTimeString(timestamp, type) {
    switch (type) {
        case "1":
            timestamp *= 1000;
            break;
        case "2":
            break;
        case "3":
        default:
            if (timestamp.toString().length === 10) {
                timestamp *= 1000;
            }
            break;
    }


    let date = new Date(timestamp);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let milliseconds = date.getMilliseconds();

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    milliseconds = milliseconds < 100 ? milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds : milliseconds;

    return year + "年" + month + "月" + day + "日 " + hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}

/**
 * 字符串转 13 位时间戳
 * @param s 字符串
 * @returns {number} 13 位时间戳
 */
function formatTimeString(s) {
    // 替换非数字为 -
    let value = s.replace(/[^\d]/g, "-").replace(/-+/g, "-");
    let res = "";
    // 以 - 分隔
    let split = value.split("-");
    // 组装字符串为 xx/xx/xx xx:xx:xx.xxx
    for (let i = 0; i < split.length; i++) {
        let item = split[i];
        if (i === 0) {
            // 第 1 位: 年
            res += item;
        } else if (i <= 2) {
            // 2-3 位: 月日
            res += "/" + item;
        } else if (i === 3) {
            // 第 4 位: 时
            res += " " + item;
        } else if (i <= 5) {
            // 5-6 位: 分秒
            res += ":" + item;
        } else if (i === 6) {
            // 第 7 位: 毫秒
            res += "." + item;
        }
    }

    // 如果最后一位为小数点，那么应该是没有输入毫秒，去掉小数点
    if (res.endsWith(".")) {
        res = res.slice(0, value.length - 1);
    }
    let date = new Date(res);
    return date.getTime();
}

/**
 * 转换数字时间戳或者字符串
 * @param s 输入
 * @param type 转换类型
 * @returns {string|number} 字符串或者数字时间戳
 */
function convert(s, type) {
    if (s == null) {
        return "";
    }
    if (s === "") {
        return "";
    }

    if (s.indexOf(".") === -1 && !isNaN(s)) {
        return getTimeString(parseInt(s), type);
    } else {
        return formatTimeString(s);
    }
}