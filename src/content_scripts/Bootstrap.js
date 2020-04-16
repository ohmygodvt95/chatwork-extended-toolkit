import { Emoticon } from './Emoticon';
import Mention from './Mention';

export class Bootstrap {
  static boot() {
    const mention = new Mention();
    mention.mentionHook();

    const emo = new Emoticon();
    emo.messageRenderHook();
    emo.sendToolbarHook();
  }
}
