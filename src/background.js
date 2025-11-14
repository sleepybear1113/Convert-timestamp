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
// 此文件在 Manifest V3 中不再需要，因为功能已移至 service-worker.js
// 保留此文件以保持向后兼容性，但内容已清空
