var extpay = ExtPay('khanhack');
// Check payment status immediately when content script runs
chrome.storage.local.get(['paid'], function(result) {
    if (result.paid) {
        injectScriptFile();
    } else {
        console.log("User has not paid, scripts will not be injected.");
    }
});

// Listen for messages from popup.js or other parts of the extension
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "checkPaidStatus") {
        chrome.storage.local.get(['paid'], function(result) {
            if (result.paid) {
                injectScriptFile();
            } else {
                console.log("User has not paid, scripts will not be injected.");
            }
        });
    } else if (request.action === "removeInjectedScripts") {
        removeScriptFile();
    }
});

function injectScriptFile() {
    if (!document.getElementById('khanhack')) {
        const scriptElement = document.createElement('script');
        scriptElement.src = chrome.runtime.getURL('inject.js');
        (document.head || document.documentElement).appendChild(scriptElement);
    }
}

function removeScriptFile() {
    const scriptElement = document.getElementById('khanhack');
    if (scriptElement) {
        scriptElement.remove();
        console.log("Injected script has been removed.");
    }
}