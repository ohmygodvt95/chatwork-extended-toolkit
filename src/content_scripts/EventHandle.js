import $ from 'jquery';
import { Emoticon } from './Emoticon';
import EmoticonDialog from './EmoticonDialog';
import Mention from './Mention';

export default class EventHandle {
  constructor() {
    this.emoticon = new Emoticon();
    this.emoticonDialog = new EmoticonDialog();
    this.mention = new Mention();
  }

  messageRenderEvent() {
    const context = this;

    $('currentselectedroom').on('DOMNodeInserted', '._message', function() {
      context.emoticon.messageRenderHook();
    });
  }

  sendToolbarChangeEvent() {
    const context = this;

    const callback = function(mutationsList, observer) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
          context.emoticonDialog.sendToolbarHook();
          context.mention.mentionHook();
        }
      }
    };

    const observer = new MutationObserver(callback);
    const targetNode = document.getElementById('_chatSendArea');
    observer.observe(targetNode, { childList: true });
  }
}
