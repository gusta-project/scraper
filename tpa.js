const util = require('./util.js');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const urlPrefix = 'https://shop.perfumersapprentice.com';
util.httpGet(urlPrefix + '/c-54-professional-flavors.aspx',
  function(rawHTML) {
    const dom = new JSDOM(rawHTML);
    var ul = dom.window.document.querySelector(".big-links");
    var elements = Array.prototype.slice.call(ul.getElementsByTagName("a"));

    elements.map(function(element) {
      // console.error("fetching: " + urlPrefix + element.href);
      util.httpGet(urlPrefix + element.href, function(rawHTML) {
        const dom = new JSDOM(rawHTML);
        var ul = dom.window.document.querySelector(".product-listing");
        var elements = Array.prototype.slice.call(ul.getElementsByTagName("h2"));
        elements.map(function(element) {
          var value = element.innerHTML;
          // remove everything after and including Flavor
          const matchInfo = value.match(/([\w\d\s\(\)]+) Flavor( \(([A-Z]+)\))?/);
          if (matchInfo) {
            console.log(`${matchInfo[1]}\t${matchInfo[3] || 'PG'}`);
          } else {
            console.error(`Failed to parse: ${value}`);
          }
        });
      });
    });
  });
