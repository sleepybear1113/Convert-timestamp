/**
 * 发送消息到 background.js
 */
window.onmouseup = function () {
    let selection = window.getSelection();
    if (selection != null) {
        chrome.runtime.sendMessage(selection.toString());
    } else {
        chrome.runtime.sendMessage("");
    }
}