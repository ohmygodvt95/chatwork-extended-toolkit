import EventHandle from './EventHandle';

export class Bootstrap {
  static boot() {
    const eventHandle = new EventHandle();
    eventHandle.messageRenderEvent();
    eventHandle.sendToolbarChangeEvent();
  }
}
