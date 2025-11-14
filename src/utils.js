/**
 * 时间戳转字符串
 * @param {number} timestamp - 10/13 位时间戳
 * @param {string} type - 转换类型
 * @returns {string} 可视化时间字符串
 */
function getTimeString(timestamp, type) {
    // 根据类型调整时间戳
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

    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    return formatDate(year, month, day, hours, minutes, seconds, milliseconds);
}

/**
 * 格式化日期和时间
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @param {number} hours - 时
 * @param {number} minutes - 分
 * @param {number} seconds - 秒
 * @param {number} milliseconds - 毫秒
 * @returns {string} 格式化后的日期时间字符串
 */
function formatDate(year, month, day, hours, minutes, seconds, milliseconds) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMilliseconds = milliseconds < 100 ?
        (milliseconds < 10 ? `00${milliseconds}` : `0${milliseconds}`) :
        milliseconds;

    return `${year}年${month}月${day}日 ${hours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

/**
 * 字符串转 13 位时间戳
 * @param {string} s - 字符串
 * @returns {number} 13 位时间戳
 */
function formatTimeString(s) {
    let value = s.replace(/[^\d]/g, "-").replace(/-+/g, "-");

    if (value.startsWith("-")) {
        value = value.substring(1);
    }
    if (value.endsWith("-")) {
        value = value.slice(0, -1);
    }

    let result = "";
    const parts = value.split("-");
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === 0) {
            result += part; // 年
        } else if (i <= 2) {
            result += `/${part}`; // 月日
        } else if (i === 3) {
            result += ` ${part}`; // 时
        } else if (i <= 5) {
            result += `:${part}`; // 分秒
        } else if (i === 6) {
            result += `.${part}`; // 毫秒
        }
    }

    if (result.endsWith(".")) {
        result = result.slice(0, -1);
    }

    const date = new Date(result);
    return date.getTime();
}

/**
 * 转换数字时间戳或者字符串
 * @param {string|number} s - 输入
 * @param {string} type - 转换类型
 * @returns {string|number} 字符串或者数字时间戳
 */
function convert(s, type) {
    if (s == null || s === "") {
        return "";
    }

    if (s.indexOf(".") === -1 && !isNaN(s)) {
        return getTimeString(parseInt(s, 10), type);
    } else {
        return formatTimeString(s);
    }
}