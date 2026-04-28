let now;
let goStatus = true;
let interval;
let gap = 1000;
let timestampJudgeType = "3";
let msgTimer = null;

const msgSpan = document.getElementById("msg");

const bjTimeInput = document.getElementById("bjTime");
const inputInput = document.getElementById("input");
const timestampNowInput = document.getElementById("timestamp-now");
const resultInput = document.getElementById("result");
const goonCheckBox = document.getElementById("goon");
const gapInput = document.getElementById("gap");

const refreshButton = document.getElementById("refresh");
const changeButton = document.getElementById("change");
const nowButton = document.getElementById("now");
const pasteButton = document.getElementById("paste");
const exchangeEachOtherButton = document.getElementById("exchange-each-other");
const copyTimestampButton = document.getElementById("copy_timestamp");
const copyTimeButton = document.getElementById("copy_time");
const clearButton = document.getElementById("clear");
const copyResultButton = document.getElementById("copy_result");
const showAlertCheckbox = document.getElementById("show-alert-checkbox");

const only10Radio = document.getElementById("only-10-radio");
const only13Radio = document.getElementById("only-13-radio");
const both10_13 = document.getElementById("both-10-13-radio");

function msg(text) {
    if (msgTimer) {
        clearTimeout(msgTimer);
        msgTimer = null;
    }

    msgSpan.innerText = text;
    if (!text || text === "　") {
        return;
    }

    msgTimer = setTimeout(function () {
        msgSpan.innerText = "　";
        msgTimer = null;
    }, 1200);
}

function storageGet(callback) {
    chrome.storage.local.get(DEFAULT_SETTINGS, callback);
}

function storageSet(value) {
    chrome.storage.local.set(value);
}

function getTimestamp13() {
    return now.getTime();
}

function refresh() {
    now = new Date();
    const timestamp = getTimestamp13();
    timestampNowInput.value = timestamp;
    bjTimeInput.value = getTimeString(timestamp);
}

function stopInterval() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function startInterval() {
    stopInterval();
    if (!goStatus || gap <= 0) {
        return;
    }

    interval = setInterval(function () {
        refresh();
    }, gap);
}

function refreshWithInterval(shouldRefresh) {
    if (shouldRefresh !== false) {
        refresh();
    }
    startInterval();
}

function change() {
    const value = inputInput.value.trim().toString();
    resultInput.value = convert(value, timestampJudgeType);
}

function sendStrToInput(text) {
    inputInput.value = text == null ? "" : String(text);
    change();
}

function refreshGap() {
    const rawValue = String(gapInput.value).trim();
    if (!/^\d+$/.test(rawValue)) {
        gapInput.value = gap;
        msg("刷新间隔需为正整数");
        return false;
    }

    const value = parseInt(rawValue, 10);
    if (value === 0) {
        gap = 0;
        goStatus = false;
        gapInput.value = gap;
        goonCheckBox.checked = false;
        storageSet({ gap: gap, goStatus: goStatus });
        stopInterval();
        msg("刷新间隔为0，已关闭实时刷新");
        return true;
    }

    gap = value;
    gapInput.value = gap;
    storageSet({ gap: gap });
    return true;
}

function getNowValueByMode() {
    const timestamp = Date.now();
    if (timestampJudgeType === "1") {
        return Math.floor(timestamp / 1000);
    }
    return timestamp;
}

function applyContextState(payload) {
    const state = payload || {};
    inputInput.value = state.lastSelection == null ? "" : String(state.lastSelection);
    change();
}

async function copyValue(value) {
    const text = value == null ? "" : String(value);
    if (!text) {
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            msg("已复制到剪切板");
            return;
        } catch (e) {
            // Fallback to execCommand for compatibility.
        }
    }

    const helper = document.createElement("textarea");
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(helper);
    msg(copied ? "已复制到剪切板" : "复制失败");
}

async function pasteToInput() {
    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            inputInput.value = await navigator.clipboard.readText();
            change();
            msg("从剪切板获取！");
            return;
        } catch (e) {
            msg("读取剪切板失败");
            return;
        }
    }

    inputInput.select();
    const pasted = document.execCommand("paste");
    if (pasted) {
        change();
        msg("从剪切板获取！");
    } else {
        msg("读取剪切板失败");
    }
}

function applyTimestampJudgeType(value) {
    timestampJudgeType = value;
    storageSet({ timestampJudgeType: value });
    refresh();
    change();
}

function loadTimestampJudgeType(value) {
    switch (value) {
        case "1":
            only10Radio.checked = true;
            break;
        case "2":
            only13Radio.checked = true;
            break;
        default:
            both10_13.checked = true;
            break;
    }
}

refreshButton.onclick = function () {
    refreshWithInterval();
};

changeButton.onclick = function () {
    change();
};

inputInput.oninput = function () {
    change();
};

gapInput.onchange = function () {
    if (refreshGap()) {
        refreshWithInterval(goStatus && gap > 0);
    }
};

gapInput.onkeypress = function (event) {
    if (event.keyCode === 13) {
        if (refreshGap()) {
            refreshWithInterval(goStatus && gap > 0);
        }
    }
};

gapInput.onblur = function () {
    refreshGap();
};

inputInput.onmousedown = function (event) {
    if (event.button === 1) {
        pasteToInput();
    }
};

resultInput.onmousedown = function (event) {
    if (event.button === 1) {
        copyValue(resultInput.value);
    }
};

timestampNowInput.onmousedown = function (event) {
    if (event.button === 1) {
        copyValue(timestampNowInput.value);
    }
};

bjTimeInput.onmousedown = function (event) {
    if (event.button === 1) {
        copyValue(bjTimeInput.value);
    }
};

nowButton.onclick = function () {
    sendStrToInput(getNowValueByMode());
};

copyTimestampButton.onclick = function () {
    copyValue(timestampNowInput.value);
};

copyTimeButton.onclick = function () {
    copyValue(bjTimeInput.value);
};

pasteButton.onclick = function () {
    pasteToInput();
};

exchangeEachOtherButton.onclick = function () {
    sendStrToInput(resultInput.value);
};

clearButton.onclick = function () {
    resultInput.value = "";
    inputInput.value = "";
};

goonCheckBox.onclick = function () {
    goStatus = goonCheckBox.checked;
    if (goStatus && gap <= 0) {
        gap = DEFAULT_SETTINGS.gap;
        gapInput.value = gap;
    }
    storageSet({ goStatus: goStatus, gap: gap });
    refreshWithInterval(goStatus);
};

copyResultButton.onclick = function () {
    copyValue(resultInput.value);
};

showAlertCheckbox.onclick = function () {
    storageSet({ showAlert: showAlertCheckbox.checked });
};

only10Radio.onclick = function () {
    applyTimestampJudgeType("1");
};

only13Radio.onclick = function () {
    applyTimestampJudgeType("2");
};

both10_13.onclick = function () {
    applyTimestampJudgeType("3");
};

chrome.runtime.onMessage.addListener(function (message) {
    if (!message || message.type !== MESSAGE_TYPES.CONTEXT_UPDATED) {
        return;
    }

    applyContextState(message.payload);
});

storageGet(function (settings) {
    timestampJudgeType = settings.timestampJudgeType;
    goStatus = settings.goStatus;
    gap = settings.gap;

    if (gap <= 0) {
        gap = 0;
        goStatus = false;
    }

    goonCheckBox.checked = goStatus;
    showAlertCheckbox.checked = settings.showAlert;
    gapInput.value = gap;

    loadTimestampJudgeType(timestampJudgeType);

    refresh();
    inputInput.focus();

    applyContextState(settings);
    startInterval();
});
