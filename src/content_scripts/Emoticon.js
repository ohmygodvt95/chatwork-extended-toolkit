import $ from 'jquery';
import store from '../store';
import Popover from '../lib/Popover';
import Mention from './Mention';

export class Emoticon {
  constructor() {
    console.log('Emoticon loader');
    $(document).on('click', '.emo-btn-select', function() {
      let text = $(this).attr('title');
      let src = $(this).attr('data-src');
      window.Common.insertAtCursor('#_chatText', text);
      let recent = JSON.parse(localStorage.getItem('CWEE_RECENT_EMOTICONS') || '[]')
      recent = recent.filter(e => e.key !== text)
      recent.unshift({
          key: text,
          src: src
        })
      localStorage.setItem('CWEE_RECENT_EMOTICONS', JSON.stringify(recent.slice(0, 12)))
      if (window.listEmosDialog) {
        window.listEmosDialog.close(document)
      }
    })

    $(document).on('click', '.button-emo-package', function() {
      let text = $(this).text()
      $('.emoticon-container').html(Emoticon.emoListBuilder(text))
      window.observerImage.observe();
    })
  }

  messageRenderHook() {
    $('currentselectedroom').on('DOMNodeInserted', '._message', function(e) {
      const elements = $('currentselectedroom ._message pre:not(.cwep-icon)');
      for (const e of elements) {
        const html = e.innerHTML;
        const res = html.match(/\(.+?\)/gi);
        if (res) {
          for (const r of res) {
            const src = store.state.data.filter(o => o.key === r);
            if (src.length > 0) {
              e.innerHTML = e.innerHTML.replace(r, `<img src="${src[0].src}" style="display: inline-block; max-height: 100px;" alt="${src[0].key.replace(/\(|\)/g, '')}" title="${src[0].key.replace(/\(|\)/g, '')}"/>`);
            }
          }
        }
        $(e).addClass('cwep-icon');
      }
    });
  }

  sendToolbarHook() {
    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          const toolbar = $('#_chatSendTool #_cw_emoticon');
          if (toolbar.length === 0) {
            const emoBtn = $(`<li id="_cw_emoticon" class="_showDescription chatInput__groupLive" role="button" aria-label="Stickers">
                  <span class="chatInput__iconContainer">
                    <svg viewBox="0 0 10 10" class="globalHeaderPlatform__icon" style="height: 16px!important;  width: 16px!important;">
                        <use fill-rule="evenodd" xlink:href="#icon_menuPlatform"></use>
                    </svg>
                  </span>
                </li>
            `);
            $('#_chatSendTool').append(emoBtn);
            Emoticon.emoticonDialogAttach();
            Mention.attach(document.getElementById('_chatText'));
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    // Select the node that will be observed for mutations
    const targetNode = document.getElementById('_chatSendArea');
    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    observer.observe(targetNode, config);
  }

  static emoListBuilder(packageName = 'Recent') {
    let packageList = [];
    if (packageName === 'Recent') {
      packageList = JSON.parse(localStorage.getItem('CWEE_RECENT_EMOTICONS') || '[]');
    }  else {
      const emos = JSON.parse(localStorage.getItem('YACEP_EMO_DATA') || '[]');
      packageList = emos.filter(e => {
        return e.data_name === packageName
      })
    }
    let list = '';
    for (let e of packageList) {
      list += `
        <li class="emoticonTooltip__emoticonContainer emo-btn-select" title="${e.key}" data-src="${e.src}"
        style="width: 80px!important; padding: 10px; height: 80px; position: relative!important; margin-bottom: 25px!important;">
        <img data-src="${e.src}" class="lozad" title="${e.key}" alt="${e.key}" 
        style="width: 70px!important; height: 70px;">
        <small style="position: absolute; bottom: -20px;">${e.key}</small>
        </li>
        `
    }
    return list;
  }

  static emoticonDialogAttach() {
    function emoPackageBuilder() {
      const emoPackagesVersion = localStorage.getItem('emoticon_data_version') || ''
      const packages = emoPackagesVersion.split(' ').map(p => {
        return p.split('_')[0]
      }).filter(p => p.length > 0)
      let html = '<button class="button-emo-package btn-recent-emo">Recent</button>';
      for (let p of packages) {
        html += `<button class="button-emo-package">${p}</button>`
      }
      return html;
    }

    const html = `<div id="_emoticonListDialogPlus" class="emoticonTooltip tooltip tooltip--white" role="tooltip" style="width: 350px;">
      <div class="_cwTTTriangle tooltipTriangle tooltipTriangle--whiteBottom" style="left: 170px;"></div>
      <div class="_cwLTSearchArea tooltip__optionContainer">
         <a href="${chrome.extension.getURL('/options/options.html#/')}" target="_blank">Add more emoticon</a>
      </div>
      <ul id="_emoticonGallery" class="emoticonTooltip__emoticonGallery emoticon-container" style="height: 300px; overflow-y: auto; width: 340px; overflow-x: hidden;">
        ${Emoticon.emoListBuilder()}
      </ul>
      <div class="emo-package-container">
        ${emoPackageBuilder()}
      </div>
    </div>`;
    $('body #_wrapper').append($(html));

    const btn = document.querySelector('#_cw_emoticon');
    const template = document.querySelector('#_emoticonListDialogPlus');
    Popover.TOP = 'top';
    /* eslint-disable no-new */
    window.listEmosDialog = new Popover(template, btn, {
      position: Popover.TOP,
    }, function() {
      $('.emoticon-container').html(Emoticon.emoListBuilder())
      window.observerImage.observe();
    });
  }
}
