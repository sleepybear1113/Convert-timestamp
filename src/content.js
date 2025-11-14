/**
 * 发送消息到 service worker
 */
window.onmouseup = function () {
    let selection = window.getSelection();
    if (selection != null) {
        chrome.runtime.sendMessage(selection.toString());
    } else {
        chrome.runtime.sendMessage("");
    }
}

// 监听来自service worker的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "showAlert") {
        alert(request.message);
    }
});