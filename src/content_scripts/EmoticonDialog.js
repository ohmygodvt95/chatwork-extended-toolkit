import $ from 'jquery';
import Popover from '../lib/Popover';

export default class EmoticonDialog {
  constructor() {
    this.registerEmoticonGlobalEvent();
    this.emoticonsDataVersion = localStorage.getItem('CWET_EMOS_PACKAGE_LIST') || '';
  }

  sendToolbarHook() {
    if (!this.emoticonDiaglogHasAttached()) {
      this.addEmoticonButtonInToolbar();
      this.addEmoticonDialogInToolbar();
    }
  }

  registerEmoticonGlobalEvent() {
    const context = this;
    $(document).on('click', '.emo-btn-select', function() {
      const text = $(this).attr('title');
      const src = $(this).attr('data-src');
      window.Common.insertAtCursor('#_chatText', text);
      let recent = JSON.parse(localStorage.getItem('CWET_RECENT_EMOTICONS') || '[]');
      recent = recent.filter(e => e.key !== text);
      recent.unshift({
        key: text,
        src: src,
      });
      localStorage.setItem('CWET_RECENT_EMOTICONS', JSON.stringify(recent.slice(0, 12)));
      if (window.listEmosDialog) {
        window.listEmosDialog.close(document);
      }
    });

    $(document).on('click', '.button-emo-package', function() {
      const text = $(this).text();
      $('.emoticon-container').html(context.emoticonsListBuilder(text));
      window.observerImage.observe();
    });
  }

  emoticonDiaglogHasAttached() {
    return $('#_chatSendTool #_cwet_emoticon').length !== 0;
  }

  addEmoticonButtonInToolbar() {
    const emoBtn = $(`<li id="_cwet_emoticon" class="_showDescription chatInput__groupLive" role="button" aria-label="Stickers">
      <span class="chatInput__iconContainer">
        <svg viewBox="0 0 10 10" class="globalHeaderPlatform__icon" style="height: 16px!important;  width: 16px!important;">
            <use fill-rule="evenodd" xlink:href="#icon_menuPlatform"></use>
        </svg>
      </span>
    </li>`);
    $('#_chatSendTool').append(emoBtn);
  }

  addEmoticonDialogInToolbar() {
    const context = this;
    $('body #_wrapper').append($(this.dialogBuilder()));

    const btn = document.querySelector('#_cwet_emoticon');
    const template = document.querySelector('#_emoticonListDialogPlus');

    Popover.TOP = 'top';
    window.listEmosDialog = new Popover(
      template,
      btn,
      {
        position: Popover.TOP,
      },
      function() {
        $('.emoticon-container').html(context.emoticonsListBuilder());
        window.observerImage.observe();
      }
    );
  }

  dialogBuilder() {
    return `<div id="_emoticonListDialogPlus" class="emoticonTooltip tooltip tooltip--white" role="tooltip" style="width: 350px; ">
      <div class="_cwTTTriangle tooltipTriangle tooltipTriangle--whiteBottom" style="left: 170px;"></div>
      <div class="_cwLTSearchArea tooltip__optionContainer">
         <span class="current-emo-tab"></span>
         <a href="${chrome.extension.getURL('/options/options.html#/')}" target="_blank" style=" line-height: 16px; float: right">
            <span style="">Sticker setting</span>
         </a>
      </div>
      <ul id="_emoticonGallery" class="emoticonTooltip__emoticonGallery emoticon-container" style="justify-content: center;height: 300px; overflow-y: auto; width: 340px; overflow-x: hidden;">
        ${this.emoticonsListBuilder()}
      </ul>
      <div class="emo-package-container">
        ${this.emoticonPackageBuilder()}
      </div>
    </div>`;
  }

  emoticonsListBuilder(packageName = 'Recent') {
    let packageList = [];
    if (packageName === 'Recent') {
      packageList = JSON.parse(localStorage.getItem('CWET_RECENT_EMOTICONS') || '[]');
    } else {
      const emos = JSON.parse(localStorage.getItem('CWET_EMOS_LIST') || '[]');
      packageList = emos.filter(e => {
        return e.data_name === packageName;
      });
    }

    $('.current-emo-tab').text(`${packageName} (${packageList.length})`);

    if (packageList.length === 0) {
      return '<h6 style="text-align: center">You haven\'t used any icons recently</h6>';
    }

    let list = '';
    for (const e of packageList) {
      list += `<li class="emoticonTooltip__emoticonContainer emo-btn-select" title="${e.key}" data-src="${e.src}"
          style="width: 80px!important; padding: 10px; height: 80px; position: relative!important; margin-bottom: 25px!important;">
          <img data-src="${e.src}" class="lozad" title="${e.key}" alt="${e.key}" 
          style="width: 70px!important; height: 70px;">
          <small style="position: absolute; bottom: -20px;">${e.key}</small>
        </li>`;
    }
    return list;
  }

  emoticonPackageBuilder() {
    const packages = this.emoticonsDataVersion
      .split(' ')
      .map(p => {
        return p.split('_')[0];
      })
      .filter(p => p.length > 0);
    let html = '<button class="button-emo-package btn-recent-emo">Recent</button>';
    for (const p of packages) {
      html += `<button class="button-emo-package">${p}</button>`;
    }
    return html;
  }
}
