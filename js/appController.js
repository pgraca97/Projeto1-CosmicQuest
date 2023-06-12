import { LearningEnvironment } from "/js/Model/learningEnvironment.js";

export default class AppController {
  constructor() {
    this.escapeRoom = new LearningEnvironment({
      element: document.querySelector(".room-container"),
    });
    this.escapeRoom.init();
  }
}
