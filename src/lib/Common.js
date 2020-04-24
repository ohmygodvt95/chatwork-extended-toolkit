import $ from 'jquery';
import axios from 'axios';
var _ = require('lodash');

const Common = {
  insertAtCursor: function(selector, str) {
    var cursorPos = $(selector).prop('selectionStart');
    var v = $(selector).val();
    var textBefore = v.substring(0, cursorPos);
    var textAfter = v.substring(cursorPos, v.length);

    $(selector)
      .val(textBefore + str + textAfter)
      .trigger('input')
      .focus();
  },
  injectScript: function(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
  },
  initStickerDataSource: async function() {
    let context = this;
    // check sync data
    chrome.storage.sync.get(
      {
        stickerDataSource: [
          {
            name: 'Default',
            version: '2019030401',
            src: 'https://dl.dropboxusercontent.com/s/lmxis68cfh4v1ho/default.json?dl=1',
            type: 'default',
          },
          {
            name: 'Vietnamese',
            version: '2019080701',
            src: 'https://dl.dropboxusercontent.com/s/2b085bilbno4ri1/vietnamese.json?dl=1',
            type: 'default',
          },
        ],
      },
      function(item) {
        chrome.storage.sync.set(item, async function() {
          for (const i of item.stickerDataSource) {
            i.data = (await axios.get(i.src)).data.emoticons;
          }

          chrome.storage.local.set(item, function() {
            chrome.storage.local.set({
              CWET_EMOS_LIST: context.generateStickerData(item.stickerDataSource),
              CWET_EMOS_PACKAGE_LIST: context.generateStickerPackageList(item.stickerDataSource),
            })
          });
        });
      }
    );
  },
  generateStickerData: function(dataSource) {
    let data = []
    for (let source of dataSource) {
      data = [...data, ...source.data.map(i => {
        return {
          key: i.key,
          src: i.src,
          data_name: source.name,
        }
      })]
    }
    return _.uniq(data, 'key');
  },
  generateStickerPackageList: function(dataSource) {
    let name = '';
    for (let source of dataSource) {
      name += `${source.name}_${source.version} `
    }
    return name;
  }
};

export default Common;
