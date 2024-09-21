document.addEventListener('DOMContentLoaded', function () {
    const extpay = ExtPay('khanhack');
    extpay.startBackground();

    document.getElementById("paymentButton").onclick = () => extpay.openPaymentPage();
    document.getElementById("manageButton").onclick = () => extpay.openPaymentPage();
    document.getElementById("loginButton").onclick = () => extpay.openLoginPage();

    // Initial check of user status
    checkUserStatus();

    // Listen for when the user pays
    if (extpay.onPaid && extpay.onPaid.addListener) {
        extpay.onPaid.addListener(user => {
            console.log('User paid!');
            chrome.storage.local.set({ paid: true });
            updateUI(true);
            checkAndInject();
        });
    }

    // Function to check and handle user payment status
    function checkUserStatus() {
        extpay.getUser().then(user => {
            const isPaid = user.paid;
            chrome.storage.local.set({ paid: isPaid });
            updateUI(isPaid);

            if (isPaid) {
                checkAndInject();
            } else {
                removeInjectedScripts();
            }
        }).catch(err => {
            console.error("Error fetching user status:", err);
        });
    }

    // Initial UI update and script injection check
    chrome.storage.local.get(['paid'], function(result) {
        updateUI(!!result.paid);
        if (result.paid) {
            checkAndInject();
        } else {
            removeInjectedScripts();
        }
    });

    function updateUI(isPaid) {
        const displaySetting = isPaid ? "none" : "block";
        document.getElementById("paymentButton").style.display = displaySetting;
        document.getElementById("loginButton").style.display = displaySetting;
        document.getElementById("manageButton").style.display = isPaid ? "block" : "none";
        document.getElementById("paidStatus").textContent = isPaid ? "Paid!" : "Unpaid";
        document.querySelectorAll("#statusReader").forEach(el => {
            el.textContent = isPaid ? "ACTIVATED" : "OFF (pay to activate)";
        });
    }

    function checkAndInject() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "checkPaidStatus" });
        });
    }

    function removeInjectedScripts() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "removeInjectedScripts" });
        });
    }
});