const SearchChain = require('../index');
const chai = require('chai');

const assert = chai.assert,
  expect = chai.expect,
  should = chai.should();

describe('Load SearchStream', () => {

  it('loading class SearchStream', function () {

    var inputStr = `
    <html><body>
    <div data-component='BestSellers' id='app1'></div><div data-component='Home' id='app2'></div>
    </body></html>
    `;

    var regex = /<div data-component\=\'([a-z]+)\'([^>]+[^\/>])?(?:\/|>([\s\S]*?)<\/div)>/i;

    console.log(typeof regex);

    let ss = new SearchChain(regex, function () {
      return Promise.resolve('html');
    });

    var f = {
      write: function (chunk) {
        console.log(chunk);
      },
      end: function (chunk) {
        console.log(chunk);
      }
    };


    ss.searchNReplace(inputStr, f)
      .then(() => {
        console.log(writeStream.toString('utf-8'))
      });


  });

});