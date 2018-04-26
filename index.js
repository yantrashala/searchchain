

class SearchChain {

  constructor(regex, replaceFn) {
    this.regex = new RegExp(regex.source, 'gi');;
    this.replaceFn = replaceFn;
  }

  searchNReplace(inputString, outputStream) {

    var tokens = this.splitChunk(inputString);

    var promiseArray = [];
    var tokenPromise;

    var self = this;
    tokens.forEach(function (token, index) {

      // for first element there is no previous promise
      if (index === 0) {
        tokenPromise = self.processToken(token, Promise.resolve(''));
      } else {
        tokenPromise = self.processToken(token, promiseArray[index - 1]);
      }
      // store promise to array
      promiseArray.push(tokenPromise);
      // once promise is fulfilled, write to response stream
      tokenPromise.then(function (outputString) {

        if (typeof outputString === 'string') {
          outputStream.write(outputString, 'utf-8');

          if (index === tokens.length - 1) {
            outputStream.end();
          }
        }
      }).catch(function (e) {
        console.log(e);
      });
    });
    return Promise.all(promiseArray);
  }

  processToken(token, previousPromise) {
    // previousPromise should always be the second promise is "all" sequence
    if (token.static) {
      return Promise.all(Promise.resolve(token.value), previousPromise);
    } else {
      console.log(this.replaceFn.toString());
      return Promise.all(this.replaceFn(token.name, token.value), previousPromise);
    }
  }

  splitChunk(inputString) {
    var ind = 0;
    var match;
    var outputArray = [];

    while ((match = this.regex.exec(inputString))) {

      outputArray.push({
        'static': true,
        'value': inputString.slice(ind, match.index)
      });

      ind = match.index + match[0].length;

      outputArray.push({
        'static': false,
        'value': match.slice(1)
      });
    }

    outputArray.push({
      'static': true,
      'value': inputString.slice(ind, inputString.length)
    });

    return outputArray;
  }

}

export default SearchChain;