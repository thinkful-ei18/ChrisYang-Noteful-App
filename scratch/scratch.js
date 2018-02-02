'use strict';

const timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(function () {
    resolve('Heads!');
  }, 1000);
});

timeoutPromise.then(msg => {
  console.log(msg);
});