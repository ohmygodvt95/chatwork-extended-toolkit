import $ from 'jquery';

export default class Common {
  constructor() {
    this.flag = '_cwet_common_bar';
    this.registerCommonGlobalEvent();
  }

  sendToolbarHook() {
    if (!this.isCommonBarAttached()) {
      this.addCommonBarInToolbar();
    }
  }

  isCommonBarAttached() {
    return $('#_chatSendTool #_cwet_common_bar').length !== 0;
  }

  addCommonBarInToolbar() {
    const titleBtn = $(`<li id="_cwet_common_bar" class="_showDescription chatInput__groupLive" style="width: auto" role="button" aria-label="title">
      <span class="chatInput__iconContainer">
        [title]
      </span>
    </li>`);
    const infoBtn = $(`<li id="_cwet_common_bar_info" class="_showDescription chatInput__groupLive" style="width: auto" role="button" aria-label="info">
      <span class="chatInput__iconContainer">
        [info]
      </span>
    </li>`);
    const codeBtn = $(`<li id="_cwet_common_bar_code" class="_showDescription chatInput__groupLive" style="width: auto" role="button" aria-label="code">
      <span class="chatInput__iconContainer">
        [code]
      </span>
    </li>`);

    $('#_chatSendTool')
      .append(titleBtn)
      .append(infoBtn)
      .append(codeBtn);
  }

  registerCommonGlobalEvent() {
    $(document).on('click', '#_cwet_common_bar', function() {
      window.Common.insertAtCursor('#_chatText', '[title][/title]');
    });

    $(document).on('click', '#_cwet_common_bar_info', function() {
      window.Common.insertAtCursor('#_chatText', '[info][/info]');
    });

    $(document).on('click', '#_cwet_common_bar_code', function() {
      window.Common.insertAtCursor('#_chatText', '[code][/code]');
    });
  }
}
