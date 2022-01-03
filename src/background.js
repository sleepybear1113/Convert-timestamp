let titleId = "convert";

chrome.contextMenus.create({
    title: "时间戳转换",
    id: titleId,
    contexts: ["selection"],
    onclick: function (params) {
        let selectionText = params.selectionText;
        let convertStr = convert(selectionText, localStorage.timestampJudgeType);
        localStorage.selectText = convertStr;

        if (!(localStorage.showAlert === "false")) {
            alert(convertStr);
        }
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let convertStr = convert(message, localStorage.timestampJudgeType) + " ";
    chrome.contextMenus.update(titleId, {
        "title": convertStr,
    });
});