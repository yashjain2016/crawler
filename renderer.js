'use strict'

const puppeteer = require('puppeteer')

var browser = null;
var blacklist = [
    'google.com',
    'facebook.com',
    'zoho.com',
    'doubleclick.net'
];
var launch = function (cb) {
    if (browser) {
        return cb(browser);
    }
    puppeteer.launch().then(function (browser) {
        browser = browser;
        return cb(browser);
    }, function (err) {
        console.log("failed to launch the browser", err);
    });
}

module.exports.loadPage = function (url, cb) {
    launch(function (browser) {
            browser.newPage().then(function (page) {
                console.log("created new page");
                page.setRequestInterception(true);
                page.on('request', function (interceptedRequest) {
                   // console.log(interceptedRequest.url, "::", interceptedRequest.resourceType);
                    var blockedTypes = ['stylesheet', 'image', 'media', 'font', 'manifest'];
                    if(blockedTypes.indexOf(interceptedRequest.resourceType) > -1) {
                      //  console.log("Blocking url [" + interceptedRequest.url + "] of type [" + interceptedRequest.resourceType + "]");
                        interceptedRequest.abort();

                    }
                    else {
                        interceptedRequest.continue();
                    }
                    // if (interceptedRequest.url.endsWith('.png') || interceptedRequest.url.endsWith('.jpg') ||
                    //     interceptedRequest.url.endsWith('.svg') || interceptedRequest.url.endsWith('.css')
                    // )
                    //     interceptedRequest.abort();
                    // else
                    //     interceptedRequest.continue();
                })
                ;
                page.goto(url).then(function (response) {
                    console.log("Status", response.status);
                    console.log("ok", response.ok);
                    page.content().then(function (content) {
                        cb(response.status, content);

                    }, function (err) {

                        console.log("Failed to load content", err);
                    });

                }, function (err) {

                    console.log("Failed to load yahoo", err);
                });

            }, function (err) {

                console.log("Failed to create new page", err);
            });
        }
    );
}