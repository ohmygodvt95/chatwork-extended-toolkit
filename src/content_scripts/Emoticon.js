import $ from 'jquery';
import store from '../store';

export class Emoticon {
  constructor() {
    this.flag = 'cwet-emoticon';
  }

  messageRenderHook() {
    const elements = this.findCandidates();
    for (const e of elements) {
      const html = e.innerHTML;
      const res = html.match(/\(.+?\)/gi);
      if (res) {
        for (const r of res) {
          const src = store.state.data.filter(o => o.key === r);
          if (src.length > 0) {
            this.messageTransform(r, src[0], e);
          }
        }
      }
      $(e).addClass(this.flag);
    }
  }

  messageTransform(emoticonKey, emoticonObject, element) {
    element.innerHTML = element.innerHTML.replace(
      emoticonKey,
      `<img src="${emoticonObject.src}" 
        style="display: inline-block; max-height: 100px;" 
        alt="${emoticonObject.key.replace(/\(|\)/g, '')}" 
        title="${emoticonObject.key.replace(/\(|\)/g, '')}"/>`
    );
  }

  findCandidates() {
    return $(`currentselectedroom ._message pre:not(.${this.flag})`);
  }
}
