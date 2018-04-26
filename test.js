const SearchChain = require('./index');

var inputStr = `<html><body>
    <div data-component='BestSellers' id='app1'></div><p>pb</p><div data-component='Home' id='app2'></div>
    </body></html>`;

var regex = /<div data-component\=\'([a-z]+)\'([^>]+[^\/>])?(?:\/|>([\s\S]*?)<\/div)>/gi;

var f = {
  data: '',
  write: function (chunk) {
    this.data = this.data + chunk;
  },
  end: function () {

  }

};


SearchChain.searchNReplace(regex, function () {
  return Promise.resolve('dynamic tag');
}, inputStr, f)
  .then(() => {
    console.log(f)
  });

