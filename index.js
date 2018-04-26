'use strict';

exports.searchNReplace = function (regex, replaceFn, inputString, outputStream) {

  var tokens = splitChunk(inputString, regex);

  var promiseArray = [];
  var tokenPromise;

  tokens.forEach(function (token, index) {


    // for first element there is no previous promise
    if (index === 0) {
      tokenPromise = processToken(token, replaceFn, Promise.resolve(''));
    } else {
      tokenPromise = processToken(token, replaceFn, promiseArray[index - 1]);
    }
    // store promise to array
    promiseArray.push(tokenPromise);
    // once promise is fulfilled, write to response stream
    tokenPromise.then(function (result) {

      let outputString = result[0];
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

function processToken(token, replaceFn, previousPromise) {
  // previousPromise should always be the second promise is "all" sequence
  if (token.static) {
    return Promise.all([Promise.resolve(token.value), previousPromise]);
  } else {
    return Promise.all([replaceFn(token.name, token.value), previousPromise]);
  }
}

function splitChunk(inputString, regex) {
  var ind = 0;
  var match;
  var outputArray = [];

  while ((match = regex.exec(inputString))) {

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
};