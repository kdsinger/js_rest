"use strict";

const request = require('request');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const utilities = require('./utilities');
const TaskQueue = require('./taskQueue');
let downloadQueue = new TaskQueue(5);

function spiderLinks(currentUrl, body, nesting, callback) {
  if(nesting === 0) {
    return process.nextTick(callback);
  }

  const links = utilities.getPageLinks(currentUrl, body);
  if(links.length === 0) {
    return process.nextTick(callback);
  }

  // let completed = 0, hasErrors = false;
  // links.forEach(link => {
  //   downloadQueue.pushTask(done => {
  //     spider(link, nesting - 1, err => {
  //       if(err) {
  //         hasErrors = true;
  //         return callback(err);
  //       }
  //       if(++completed === links.length && !hasErrors) {
  //         callback();
  //       }
  //       done();
  //     });
  //   });
  // });
}

function saveFile(filename, contents, callback) {
  console.log(filename);
  callback(null, contents, callback);
}
let spidering = new Map();
function download(url, nesting, callback) {
  if(spidering.has(url)) {
    return process.nextTick(callback);
  }
  spidering.set(url, true);
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
  // kev.forEach(download)

  // if(kev.length === 0) {
  //   return process.nextTick(callback);
  // }

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