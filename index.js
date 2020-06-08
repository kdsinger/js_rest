"use strict";

const request = require('request');
const TaskQueue = require('./taskQueue');
let downloadQueue = new TaskQueue(3);

function download(url, nesting, callback) {
  console.log(`Downloading ${url}`);
  request(url, (err, response, body) => {
    if(err) {
      return callback(err);
    }
    console.log(`Downloaded and saved: ${url}`);
    return callback();
  });
}


function spider(url, nesting, callback) {
  let kev = ["http://www.google.com",
    "https://www.google.com/calendar?tab=wc",
    "https://www.google.com",
    "http://www.google.com/finance?tab=we",
    "https://www.google.com/intl/en/about/products?tab=wh"];
  let completed = 0, hasErrors = false;
  kev.forEach(link => {
    downloadQueue.pushTask(done => {
      download(link, nesting - 1, err => {
        if(err) {
          hasErrors = true;
          return callback(err);
        }
        if(++completed === kev.length && !hasErrors) {
          callback();
        }
        done();
      });
    });
  });
}

spider(process.argv[2], 3, (err) => {
  if(err) {
    console.log(err);
    process.exit();
  } else {
    console.log('Download complete');
  }
});