import Tribute from 'tributejs';

export default class Mention {
  constructor() {
    console.log('mention loader');
    window.mention = null;
  }

  mentionHook() {
    Mention.newTribute();
    Mention.attach(document.getElementById('_chatText'));
  }

  static attach(node) {
    setTimeout(function() {
      Mention.newTribute();
      if (window.mention) {
        window.mention.attach(node);
      }
    }, 500);
  }

  static newTribute() {
    window.mention = new Tribute({
      selectTemplate: function(item) {
        return item.original.value;
      },
      // template for displaying item in menu
      menuItemTemplate: function(item) {
        return `<div style="padding: 5px;">
            ${item.original.img}
            <span style="padding-left: 5px;">${item.original.key}</span>
          </div>`;
      },
      values: JSON.parse(localStorage.getItem('CWET_ROOM_USERS') || '[]'),
    });
  }
}
