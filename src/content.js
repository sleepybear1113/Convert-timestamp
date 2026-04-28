let lastSelectionText = "";

function getSelectionText() {
    const selection = window.getSelection();
    if (!selection) {
        return "";
    }
    return selection.toString().trim();
}

function sendSelectionChanged() {
    const selectionText = getSelectionText();
    if (selectionText === lastSelectionText) {
        return;
    }

    lastSelectionText = selectionText;
    chrome.runtime.sendMessage({
        type: MESSAGE_TYPES.SELECTION_CHANGED,
        payload: {
            text: selectionText
        }
    }, function () {
        void chrome.runtime.lastError;
    });
}

async function copyText(text) {
    const value = text == null ? "" : String(text);
    if (!value) {
        return false;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(value);
            return true;
        } catch (e) {
            // Fallback to execCommand for pages where Clipboard API is unavailable.
        }
    }

    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
}

window.addEventListener("mouseup", sendSelectionChanged);
document.addEventListener("selectionchange", sendSelectionChanged);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message || !message.type) {
        return;
    }

    if (message.type === MESSAGE_TYPES.COPY_TEXT) {
        copyText(message.payload && message.payload.text)
            .then(function (ok) {
                sendResponse({ ok: ok });
            })
            .catch(function () {
                sendResponse({ ok: false });
            });
        return true;
    }

    if (message.type === MESSAGE_TYPES.SHOW_ALERT) {
        const text = message.payload && message.payload.text ? message.payload.text : "";
        if (text) {
            alert(text);
        }
    }
});
