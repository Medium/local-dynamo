// Copyright 2015 A Medium Corporation.

var localDynamo = require('../lib/launch')

exports.testMemory = function (test) {
  localDynamo.launch({
    port: 8676,
    heap: '512m',
    stdio: 'inherit',
    version: '2015-07-16_1.0'
  }, function(err, dynamo){
    if (err) throw err

    var finished = false

    dynamo.on('exit', function (code) {
      if (finished) return

      finished = true
      test.ok(false, 'Unexpected exit code ' + code)
      test.done()
    })

    // If everything goes well after 5 seconds, then we're done!
    setTimeout(function () {
      finished = true
      dynamo.kill()
      test.done()
    }, 5000).unref()
  })
}
