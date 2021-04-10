let titleId = "convert";

chrome.contextMenus.create({
    title: "时间戳转换",
    id: titleId,
    contexts: ["selection"],
    onclick: function (params) {
        let s = params.selectionText;
        alert(s + "\n" + convert(s));
    }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    chrome.contextMenus.update(titleId, {
        "title": convert(message) + " "
    });
});