/**
 * 发送消息到 background.js
 */
window.onmouseup = function () {
    let selection = window.getSelection();
    chrome.runtime.sendMessage(selection.toString());
}