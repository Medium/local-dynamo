// Copyright 2015 A Medium Corporation.

var localDynamo = require('../lib/launch')

exports.testMemory = function (test) {
  var dynamo = localDynamo.launch({
    port: 8676,
    heap: '512m',
    stdio: 'pipe'
  })
  dynamo.stdout.on('data', function (data) {
    console.log('stdout', data.toString())
  })
  dynamo.stderr.on('data', function (data) {
    console.log('stderr', data.toString())
  })

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
}

exports.testSharedDb = function (test) {
  var dynamo = localDynamo.launch({
    port: 8676,
    sharedDb: true,
    stdio: 'pipe'
  })
  dynamo.stdout.on('data', function (data) {
    console.log('stdout', data.toString())
  })
  dynamo.stderr.on('data', function (data) {
    console.log('stderr', data.toString())
  })

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
}


exports.testCors = function (test) {
  var dynamo = localDynamo.launch({
    port: 8676,
    cors: 'medium.com',
    stdio: 'pipe'
  })
  dynamo.stdout.on('data', function (data) {
    console.log('stdout', data.toString())
  })
  dynamo.stderr.on('data', function (data) {
    console.log('stderr', data.toString())
  })

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
}
