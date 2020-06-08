/*
Used to throttle the number of concurrent rest request spawned but the DTP Reporter.
Max allowed number of active rest requests is identified in the dtp_report.js
 */
"use strict";

module.exports = class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask (task) {
    this.queue.push(task);
    this.next();
  }

  next() {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      task (() => {
        this.running--;
        this.next();
      });
      this.running++;
    }
  }
};
