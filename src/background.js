import Common from './lib/Common';

chrome.runtime.onInstalled.addListener(details => {
  // const currentVersion = chrome.runtime.getManifest().version;
  // const previousVersion = details.previousVersion;
  const reason = details.reason;

  switch (reason) {
    case 'install':
      chrome.storage.sync.get(
        {
          stickerDataSource: [],
        },
        function(item) {
          if (item.stickerDataSource.length === 0) {
            (async () => {
              try {
                await Common.initStickerDataSource();
              } catch (e) {
                // Deal with the fact the chain failed
              }
            })();
          }
        }
      );
      break;
    case 'update':
      break;
    case 'chrome_update':
    case 'shared_module_update':
    default:
      alert('Other install events within the browser');
      break;
  }
});
