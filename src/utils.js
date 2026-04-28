/**
 * 时间戳转字符串
 * @param timestamp 13 位时间戳
 * @returns {string} 可视化时间字符串
 */
function getTimeString(timestamp) {
    if (timestamp == null || timestamp === "" || isNaN(Number(timestamp))) {
        return "";
    }

    let date = new Date(Number(timestamp));
    if (isNaN(date.getTime())) {
        return "";
    }
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

function normalizeTimestamp(timestamp, type) {
    if (timestamp == null) {
        return null;
    }

    const value = String(timestamp).trim();
    if (!/^\d+$/.test(value)) {
        return null;
    }

    const numericValue = Number(value);
    if (!isFinite(numericValue)) {
        return null;
    }

    switch (type) {
        case "1":
            return numericValue * 1000;
        case "2":
            return numericValue;
        case "3":
        default:
            if (value.length === 10) {
                return numericValue * 1000;
            }
            if (value.length === 13) {
                return numericValue;
            }
            return null;
    }
}

/**
 * 字符串转 13 位时间戳
 * @param s 字符串
 * @returns {number} 13 位时间戳
 */
function formatTimeString(s) {
    if (s == null) {
        return "";
    }

    const raw = String(s).trim();
    if (!raw) {
        return "";
    }

    // 替换非数字为 -
    let value = raw.replace(/[^\d]/g, "-").replace(/-+/g, "-");
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
        res = res.slice(0, res.length - 1);
    }
    let date = new Date(res);
    let timestamp = date.getTime();
    if (isNaN(timestamp)) {
        return "";
    }
    return timestamp;
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

    const value = String(s).trim();
    if (value === "") {
        return "";
    }

    if (/^\d+$/.test(value)) {
        const normalized = normalizeTimestamp(value, type);
        return normalized == null ? "" : getTimeString(normalized);
    }

    return formatTimeString(value);
}