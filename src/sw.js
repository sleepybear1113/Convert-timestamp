importScripts("config.js", "utils.js");

function getSettings(callback) {
    chrome.storage.local.get(DEFAULT_SETTINGS, callback);
}

function ensureDefaults() {
    getSettings(function (settings) {
        chrome.storage.local.set(settings);
    });
}

function getMenuTitle(selectionText, timestampJudgeType) {
    if (!selectionText) {
        return "时间戳转换";
    }

    const result = convert(selectionText, timestampJudgeType);
    if (result === "" || result == null) {
        return "时间戳转换";
    }
    return result + " (单击复制)";
}

function rebuildMenu() {
    chrome.contextMenus.removeAll(function () {
        chrome.contextMenus.create({
            id: MENU_ID,
            title: "时间戳转换",
            contexts: ["selection"]
        });
    });
}

function updateMenuTitle(selectionText) {
    getSettings(function (settings) {
        const title = getMenuTitle(selectionText, settings.timestampJudgeType);
        chrome.contextMenus.update(MENU_ID, { title: title }, function () {
            // Ignore update errors caused by menu re-creation timing.
            void chrome.runtime.lastError;
        });
    });
}

function notifyContextState(selectionText, result) {
    const payload = {
        lastSelection: selectionText,
        lastContextResult: result
    };

    chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.CONTEXT_UPDATED,
        payload: payload
    }, function () {
        void chrome.runtime.lastError;
    });
}

function persistContextState(selectionText, result) {
    const payload = {
        lastSelection: selectionText,
        lastContextResult: result
    };

    chrome.storage.local.set(payload);
}

function sendMessageToTab(tabId, message, callback) {
    if (typeof tabId !== "number") {
        if (callback) {
            callback(undefined, null);
        }
        return;
    }
    chrome.tabs.sendMessage(tabId, message, function (response) {
        const lastError = chrome.runtime.lastError;
        if (callback) {
            callback(response, lastError || null);
            return;
        }

        // Ignore disconnected tab/content-script errors.
        void lastError;
    });
}

function handleSelectionChanged(message) {
    const payload = message && message.payload ? message.payload : {};
    const selectionText = (payload.text || "").trim();

    getSettings(function (settings) {
        const result = selectionText ? convert(selectionText, settings.timestampJudgeType) : "";
        notifyContextState(selectionText, result);

        chrome.contextMenus.update(MENU_ID, { title: getMenuTitle(selectionText, settings.timestampJudgeType) }, function () {
            void chrome.runtime.lastError;
        });
    });
}

chrome.runtime.onInstalled.addListener(function () {
    ensureDefaults();
    rebuildMenu();
});

chrome.runtime.onStartup.addListener(function () {
    ensureDefaults();
    rebuildMenu();
});

chrome.runtime.onMessage.addListener(function (message) {
    if (!message || !message.type) {
        return;
    }

    if (message.type === MESSAGE_TYPES.SELECTION_CHANGED) {
        handleSelectionChanged(message);
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId !== MENU_ID) {
        return;
    }

    const selectionText = (info.selectionText || "").trim();

    getSettings(function (settings) {
        const sourceText = selectionText || settings.lastSelection || "";
        const result = sourceText ? convert(sourceText, settings.timestampJudgeType) : "";

        persistContextState(sourceText, result);
        notifyContextState(sourceText, result);

        sendMessageToTab(tab && tab.id, {
            type: MESSAGE_TYPES.COPY_TEXT,
            payload: { text: result }
        }, function (response, lastError) {
            if (lastError) {
                return;
            }

            if (!response || response.ok !== true) {
                sendMessageToTab(tab && tab.id, {
                    type: MESSAGE_TYPES.SHOW_ALERT,
                    payload: { text: "复制失败" }
                });
                return;
            }

            if (settings.showAlert && result !== "" && result != null) {
                sendMessageToTab(tab && tab.id, {
                    type: MESSAGE_TYPES.SHOW_ALERT,
                    payload: { text: result }
                });
            }
        });

        updateMenuTitle(sourceText);
    });
});

