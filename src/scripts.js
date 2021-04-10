let now;
let go = true;
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
let copyTimestampButton = document.getElementById("copy_timestamp");
let copyTimeButton = document.getElementById("copy_time");
let clearButton = document.getElementById("clear");
let copyResultButton = document.getElementById("copy_result");


function getTimestamp13() {
    return now.getTime();
}

function refresh() {
    now = new Date();
    timestampNowInput.value = getTimestamp13();
    bjTimeInput.value = getTimeString(getTimestamp13());
}

function refreshWithInterval() {
    window.clearInterval(interval);
    refresh();
    interval = getInterval();
}

function change() {
    let s = inputInput.value.trim().toString();
    resultInput.value = convert(s);
}

function paste(item) {
    item.select();
    document.execCommand('paste');
    msg("从剪切板获取！");
}

function copy(item) {
    item.select();
    document.execCommand('copy');
    msg("已复制到剪切板");
}

function msg(m) {
    msgSpan.innerText = m;
    setTimeout(function () {
        msgSpan.innerText = "　";
    }, 1000);
}

function refreshGap() {
    let value = gapInput.value;
    if (!isNaN(value)) {
        gap = parseInt(value);
    } else {
        gap = 1000;
    }
}

refresh();
inputInput.focus();

refreshButton.onclick = function () {
    refreshWithInterval();
};

changeButton.onclick = function () {
    change();
};

inputInput.oninput = function () {
    change();
};

gapInput.oninput = function () {
    refreshGap();
};

gapInput.onkeypress = function (e) {
    refreshGap();

    if (e.keyCode === 13) {
        refreshWithInterval();
    }
};

resultInput.oninput = function () {
    let value = resultInput.value;
    inputInput.value = formatTimeString(value);
};

inputInput.onmousedown = function (e) {
    if (e.button === 1) {
        paste(inputInput);
    }
};

resultInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(resultInput);
    }
};

timestampNowInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(timestampNowInput);
    }
};

bjTimeInput.onmousedown = function (e) {
    if (e.button === 1) {
        copy(bjTimeInput);
    }
};

nowButton.onclick = function () {
    inputInput.value = new Date().getTime();
    change();
};

copyTimestampButton.onclick = function () {
    copy(timestampNowInput);
};

copyTimeButton.onclick = function () {
    copy(bjTimeInput);
};

pasteButton.onclick = function () {
    paste(inputInput);
};

clearButton.onclick = function () {
    resultInput.value = "";
    inputInput.value = "";
};

goonCheckBox.onclick = function () {
    go = goonCheckBox.checked;
    if (go) {
        refreshWithInterval();
    }
};

copyResultButton.onclick = function () {
    copy(resultInput);
};

function getInterval() {
    return setInterval(function () {
        if (go) {
            refresh();
        }
    }, gap);
}

interval = getInterval();