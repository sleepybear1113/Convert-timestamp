let now;
let goStatus = true;
let interval;
let gap = 1000;

let msgSpan = document.getElementById("msg");

let bjTimeInput = document.getElementById("bjTime");
let inputInput = document.getElementById("input");
let timestampNowInput = document.getElementById("timestamp-now");
let resultInput = document.getElementById("result");
let goonCheckBox = document.getElementById("goon");
let gapInput = document.getElementById("gap");

let refreshButton = document.getElementById("refresh");
let changeButton = document.getElementById("change");
let nowButton = document.getElementById("now");
let pasteButton = document.getElementById("paste");
let exchangeEachOtherButton = document.getElementById("exchange-each-other");
let copyTimestampButton = document.getElementById("copy_timestamp");
let copyTimeButton = document.getElementById("copy_time");
let clearButton = document.getElementById("clear");
let copyResultButton = document.getElementById("copy_result");
let showAlertCheckbox = document.getElementById("show-alert-checkbox");

let only10Radio = document.getElementById("only-10-radio");
let only13Radio = document.getElementById("only-13-radio");
let both10_13 = document.getElementById("both-10-13-radio");

/**
 * 获取当前时间的13位时间戳
 * @returns {number} 当前时间的13位时间戳
 */
function getTimestamp13() {
    return now.getTime();
}

/**
 * 刷新时间显示
 */
function refresh() {
    now = new Date();
    timestampNowInput.value = getTimestamp13();
    bjTimeInput.value = getTimeString(getTimestamp13(), getTypeFromStorage());
}

/**
 * 从存储中获取时间戳判断类型
 */
function getTypeFromStorage() {
    // 默认返回 "3" (10/13位)
    return localStorage.timestampJudgeType || "3";
}

/**
 * 刷新时间显示并重置定时器
 */
function refreshWithInterval() {
    window.clearInterval(interval);
    refresh();
    interval = getInterval();
}

/**
 * 执行转换操作
 */
function change() {
    let s = inputInput.value.trim().toString();
    resultInput.value = convert(s, getTypeFromStorage());
}

/**
 * 从剪贴板粘贴内容
 * @param item 要粘贴到的元素
 */
function paste(item) {
    item.select();
    document.execCommand('paste');
    msg("从剪切板获取！");
}

/**
 * 交换输入输出框的内容
 */
function exchangeEachOther() {
    sendStrToInput(resultInput.value);
}

/**
 * 复制内容到剪贴板
 * @param item 要复制的元素
 */
function copy(item) {
    item.select();
    document.execCommand('copy');
    msg("已复制到剪切板");
}

/**
 * 显示消息并在1秒后清除
 * @param m 要显示的消息
 */
function msg(m) {
    msgSpan.innerText = m;
    setTimeout(function () {
        msgSpan.innerText = "　";
    }, 1000);
}

/**
 * 更新刷新间隔
 */
function refreshGap() {
    let value = gapInput.value;
    if (!isNaN(value)) {
        gap = parseInt(value);
    } else {
        gap = 1000;
    }
}

/**
 * 设置输入框的值并执行转换
 * @param text 要设置的文本
 */
function sendStrToInput(text) {
    inputInput.value = text;
    change();
}

// 绑定刷新按钮事件
refreshButton.onclick = function () {
    refreshWithInterval();
};

// 绑定转换按钮事件
changeButton.onclick = function () {
    change();
};

// 绑定输入框输入事件
inputInput.oninput = function () {
    change();
};

// 绑定刷新间隔输入框事件
gapInput.oninput = function () {
    refreshGap();
};

// 绑定刷新间隔输入框按键事件
gapInput.onkeypress = function (e) {
    refreshGap();

    if (e.keyCode === 13) {
        refreshWithInterval();
    }
};

// 绑定结果输入框输入事件
resultInput.oninput = function () {
    let value = resultInput.value;
    inputInput.value = formatTimeString(value);
};

// 绑定输入框鼠标按下事件
inputInput.onmousedown = function (e) {
    if (e.button === 1) {
        paste(inputInput);
    }
};

// 绑定结果框鼠标按下事件
resultInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(resultInput);
    }
};

// 绑定时间戳输入框鼠标按下事件
timestampNowInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(timestampNowInput);
    }
};

// 绑定北京时间输入框鼠标按下事件
bjTimeInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(bjTimeInput);
    }
};

// 绑定"now"按钮点击事件
nowButton.onclick = function () {
    sendStrToInput(new Date().getTime());
};

// 绑定复制时间戳按钮事件
copyTimestampButton.onclick = function () {
    copy(timestampNowInput);
};

// 绑定复制时间按钮事件
copyTimeButton.onclick = function () {
    copy(bjTimeInput);
};

// 绑定粘贴按钮事件
pasteButton.onclick = function () {
    paste(inputInput);
};

// 绑定交换按钮事件
exchangeEachOtherButton.onclick = function () {
    exchangeEachOther();
};

// 绑定清空按钮事件
clearButton.onclick = function () {
    resultInput.value = "";
    inputInput.value = "";
};

/**
 * 更改自动刷新复选框状态
 */
function changeGoCheckBox() {
    goStatus = goonCheckBox.checked;
    if (goStatus) {
        refreshWithInterval();
    }
    localStorage.goStatus = goStatus;
}

// 绑定自动刷新复选框事件
goonCheckBox.onclick = changeGoCheckBox;

// 绑定复制结果按钮事件
copyResultButton.onclick = function () {
    copy(resultInput);
};

// 绑定显示警告复选框事件
showAlertCheckbox.onclick = function () {
    let checked = showAlertCheckbox.checked;
    if (checked) {
        localStorage.showAlert = "true";
    } else {
        localStorage.showAlert = "false";
    }
};

// 绑定仅10位时间戳单选框事件
only10Radio.onclick = function () {
    localStorage.timestampJudgeType = "1";
};

// 绑定仅13位时间戳单选框事件
only13Radio.onclick = function () {
    localStorage.timestampJudgeType = "2";
};

// 绑定10/13位时间戳单选框事件
both10_13.onclick = function () {
    localStorage.timestampJudgeType = "3";
};

/**
 * 加载时间戳判断类型设置
 */
function loadTimestampJudgeType() {
    let timestampJudgeType = localStorage.timestampJudgeType;
    switch (timestampJudgeType) {
        case "1":
            only10Radio.checked = true;
            break;
        case "2":
            only13Radio.checked = true;
            break;
        case "3":
            both10_13.checked = true;
            break;
        default:
            both10_13.checked = true;
            break;
    }
}

/**
 * 加载自动刷新状态
 */
function loadGoonStatus() {
    goStatus = !(localStorage.goStatus === "false");
    goonCheckBox.checked = goStatus;
    goonCheckBox.isChecked = goStatus;
}

/**
 * 加载菜单提醒操作设置
 */
function loadMenuRadioAction() {
    showAlertCheckbox.checked = !(localStorage.showAlert === "false");
}

/**
 * 获取定时器
 * @returns {number} 定时器ID
 */
function getInterval() {
    return setInterval(function () {
        if (goStatus) {
            refresh();
        }
    }, gap);
}

// 初始化
refresh();
inputInput.focus();

inputInput.value = localStorage.selectText;
change();

loadGoonStatus();
loadMenuRadioAction();
loadTimestampJudgeType();

interval = getInterval();