// 导入工具函数
importScripts('utils.js');

let titleId = "convert";

chrome.contextMenus.create({
    title: "时间戳转换",
    id: titleId,
    contexts: ["selection"]
}, () => {
    // 处理菜单创建可能的错误
    if (chrome.runtime.lastError) {
        console.error("创建上下文菜单时出错:", chrome.runtime.lastError.message);
    }
});

// 监听菜单项点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === titleId) {
        let selectionText = info.selectionText;
        
        // 检查selectionText是否有效
        if (!selectionText) {
            console.warn("未找到选中的文本");
            return;
        }
        
        // 获取设置
        chrome.storage.local.get(['timestampJudgeType', 'showAlert'], function(result) {
            // 处理可能的存储错误
            if (chrome.runtime.lastError) {
                console.error("读取存储时出错:", chrome.runtime.lastError.message);
                return;
            }
            
            let timestampJudgeType = result.timestampJudgeType || "3";
            let showAlert = result.showAlert !== "false";
            
            try {
                let convertStr = convert(selectionText, timestampJudgeType);
                
                // 保存选中文本
                chrome.storage.local.set({selectText: convertStr}, () => {
                    if (chrome.runtime.lastError) {
                        console.error("保存选中文本时出错:", chrome.runtime.lastError.message);
                    }
                });

                if (showAlert) {
                    // 通过 tabs.sendMessage 发送消息到内容脚本显示 alert
                    chrome.tabs.sendMessage(tab.id, {action: "showAlert", message: convertStr}, () => {
                        // 忽略发送消息可能的错误
                        if (chrome.runtime.lastError) {
                            console.warn("发送消息到内容脚本时出错:", chrome.runtime.lastError.message);
                        }
                    });
                }
            } catch (e) {
                console.error("转换文本时出错:", e);
            }
        });
    }
});

// 监听来自内容脚本的消息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (typeof message === 'string') {
        // 获取设置
        chrome.storage.local.get(['timestampJudgeType'], function(result) {
            // 处理可能的存储错误
            if (chrome.runtime.lastError) {
                console.error("读取存储时出错:", chrome.runtime.lastError.message);
                return;
            }
            
            let timestampJudgeType = result.timestampJudgeType || "3";
            try {
                let convertStr = convert(message, timestampJudgeType) + " ";
                chrome.contextMenus.update(titleId, {
                    "title": convertStr,
                }, () => {
                    if (chrome.runtime.lastError) {
                        console.error("更新上下文菜单时出错:", chrome.runtime.lastError.message);
                    }
                });
            } catch (e) {
                console.error("转换文本时出错:", e);
            }
        });
        return true;
    } else if (message && message.action === "convert") {
        // 检查消息完整性
        if (!message.text) {
            sendResponse({result: ""});
            return false;
        }
        
        // 获取设置
        chrome.storage.local.get(['timestampJudgeType'], function(result) {
            // 处理可能的存储错误
            if (chrome.runtime.lastError) {
                console.error("读取存储时出错:", chrome.runtime.lastError.message);
                sendResponse({result: "错误: 无法读取配置"});
                return;
            }
            
            let timestampJudgeType = result.timestampJudgeType || "3";
            try {
                let convertStr = convert(message.text, timestampJudgeType);
                sendResponse({result: convertStr});
            } catch (e) {
                console.error("转换文本时出错:", e);
                sendResponse({result: "错误: 转换失败"});
            }
        });
        return true; // 保持消息通道开放以进行异步响应
    }
    
    // 对于未处理的消息，直接返回false
    return false;
});