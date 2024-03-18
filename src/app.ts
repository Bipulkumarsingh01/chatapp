import { PLATFORM } from 'aurelia-pal';
import { RouterConfiguration, Router } from 'aurelia-router';

export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router): void {
    this.router = router;
    config.title = 'Aurelia Chat App';
    config.map([
      { route: ['', 'chat-room'], name: 'chat-room', moduleId: PLATFORM.moduleName('./chat-room/chat-room'), nav: true, title: 'Chat Room' },
    ]);
  }
}
