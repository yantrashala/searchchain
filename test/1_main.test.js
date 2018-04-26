const SearchChain = require('../index');
const chai = require('chai');
const { Writable } = require('stream');


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

    var regex = /<div data-component\=\'([a-z]+)\'([^>]+[^\/>])?(?:\/|>([\s\S]*?)<\/div)>/i

    let ss = new SearchChain(regex, function () {
      return Promise.resolve('html');
    });

    var writeStream = new Writable();

    ss.searchNReplace(inputStr, writeStream)
      .then(() => {
        console.log(writeStream.toString())
      });


  });

});