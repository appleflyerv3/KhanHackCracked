importScripts('ExtPay.js');

var extpay = ExtPay('khanhack');
extpay.startBackground();

// Initial check
checkUserStatus();

// Set up an interval to check the payment status every 1 second
setInterval(checkUserStatus, 100); // 1000 ms = 1 second

// Function to check and handle user payment status
function checkUserStatus() {
    extpay.getUser().then(user => {
        chrome.storage.local.get(['paid'], function(result) {
            const wasPaid = result.paid;
            const isPaid = user.paid;

            // Store the current payment status
            chrome.storage.local.set({ paid: isPaid });

            // If the user just paid or just canceled their subscription, refresh the Khan Academy page
            if (isPaid && !wasPaid) {
                console.log('User just paid! Refreshing Khan Academy page...');
                refreshKhanAcademyPage();
                injectScript();
            } else if (!isPaid && wasPaid) {
                console.log('User just canceled subscription! Refreshing Khan Academy page...');
                refreshKhanAcademyPage();
                removeInjectedScripts();
            }
        });
    }).catch(err => {
        console.error("Error fetching user status:", err);
    });
}

// Function to refresh all Khan Academy tabs
function refreshKhanAcademyPage() {
    chrome.tabs.query({ url: "*://*.khanacademy.org/*" }, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.reload(tab.id);
        });
    });
}

// Function to inject the script into Khan Academy page
function injectScript() {
    chrome.tabs.query({ url: "*://*.khanacademy.org/*" }, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['contentScript.js']
            });
        });
    });
}

// Function to remove injected scripts from Khan Academy page
function removeInjectedScripts() {
    chrome.tabs.query({ url: "*://*.khanacademy.org/*" }, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['removeContentScript.js'] // Ensure this script exists and undoes the injection
            });
        });
    });
}