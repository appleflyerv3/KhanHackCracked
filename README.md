# KhanHackCracked.

this was based on the extension \ 
<https://chromewebstore.google.com/detail/KhanHack/daodbmeffhdfmdchlkenoompiebllpma>

but i cracked it.

## how to use

1. go to [Releases](https://github.com/appleflyerv3/KhanHackCracked/releases) and download the crx file provided
2. go to `chrome://extensions`, and enable developer mode on the top right
3. drag the CRX file into the page.
4. add the extension

boom done. \
now everytime you do your khanacademy questions or homework, a popup will automatically appear on the top right with the answers

this is NOT my code, its just a cracked version of someone else's extension.

## the "vulnerability"
in ExtPay.js, under the fetch_user() function, we can make it always return 
```
return {
				paid: true,
				paidAt: null,
				installedAt: storage.extensionpay_installed_at ? new Date(storage.extensionpay_installed_at) : new Date(), // sometimes this function gets called before the initial install time can be flushed to storage
				trialStartedAt: null,
			}
```

## thanks for sigma
