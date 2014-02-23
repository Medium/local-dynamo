// Copyright 2014 A Medium Corporation.

/**
 * @fileoverview A benchmark script to test the performance of an SDK.
 *   This script can test performance on both DynamoDB Local or a real
 *   Dynamo table.
 *
 * If you run the benchmark with a DynamoDB Local, the script will start
 * a DynamoDB Local instance automatically at a random port. It will also
 * create and delete the database for you.
 * 
 * If you run the benchmark with real DynamoDB Local, you need to provide
 * the AWS credentials and region. You can optionally let the script to
 * create the table before the test and delete the table after the test.
 */

var util = require('util')
var AWS = require('aws-sdk')
var Q = require('kew')
var flags = require('flags')
var metrics = require('metrics')
var ProgressBar = require('progress')

var PRGORESS_UPDATE_INTERVAL = 50
var PROVISION_THROUGHPUT = 200
var LOCAL_DYNAMO_PORT = Math.round(Math.random() * 10000) + 1024
var TABLE_NAME = 'test_benchmark_sdk'

flags.defineBoolean('use_local_dynamo', true, 'Use DynamoDB Local or a real Dynamo database')
flags.defineBoolean('create_table', true, 'Create table before testing and delete it after')
flags.defineInteger('record_size', 2048, 'The size of each record (in byte)')
flags.defineInteger('sample_size', 10000, 'The number of request to measure (each of putItem and getItem)')
flags.defineString('access_key', null, 'The AWS access key (only used when using a real Dynamo database)')
flags.defineString('secret_key', null, 'The AWS secret key (only used when using a real Dynamo database)')
flags.defineString('region', null, 'The AWS region (only used when using a real Dynamo database)')
flags.parse()

/**
 * The target database option. This is always a local database.
 *
 * @type {Object}
 */
var dynamoOptions

if (flags.get('use_local_dynamo')) {
  localDynamo = require('../lib/launch')
  localDynamo.launch('.', LOCAL_DYNAMO_PORT)
  dynamoOptions = {
    apiVersion: '2012-08-10',
    endpoint: 'localhost:' + LOCAL_DYNAMO_PORT,
    accessKeyId: 'perf',
    secretAccessKey: '***',
    region: 'benchmark',
    sslEnabled: false
  }
} else {
  dynamoOptions = {
    apiVersion: '2012-08-10',
    accessKeyId: flags.get('access_key'),
    secretAccessKey: flags.get('secret_key'),
    region: flags.get('region'),
  }
}

/**
 * The AWS database instance.
 *
 * @type {AWS.DynamoDB}
 */
var database = new AWS.DynamoDB(dynamoOptions)

/**
 * Database description
 *
 * @type {Object}
 */
var description = {
  AttributeDefinitions: [
    {
      AttributeName: 'hash',
      AttributeType: 'N'
    },
    {
      AttributeName: 'range',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'hash',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'range',
      KeyType: 'RANGE'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: PROVISION_THROUGHPUT,
    WriteCapacityUnits: PROVISION_THROUGHPUT
  },
  TableName: TABLE_NAME
}

/**
 * Benchmark one particular function.
 *
 * @param {Function} requestFn The function that makes a request to Dynamo
 * @param {Object} requestData The data of the request
 * @param {number} sampleSize How many requests to measure
 * @return {Promise.<{latency: metrics.Histogram, throughput: number, errorCount: number}>}
 */
function benchmarkFunction(requestFn, requestData, sampleSize) {
  var defer = Q.defer()
  var total = 0
  var stats = new metrics.Histogram()
  var bar = new ProgressBar('Testing [:bar] :percent :etas', {
    complete: '=',
    incomplete: ' ',
    width: 50,
    total: sampleSize / PRGORESS_UPDATE_INTERVAL,
    clear: true
  })
  var overallStartTime = Date.now()
  var errorCount = 0

  // If we use local dynamo, we can run as fast as possible,
  // but if we use real dynamo, we need to throttle the requests
  // based on the provisioned throughput. We use 80% of the provisioned
  // throughput to run the test.
  var requestPerSec
  if (flags.get('use_local_dynamo')) {
    requestPerSec = Infinity
  } else {
    requestPerSec = Math.round(PROVISION_THROUGHPUT * 0.8)
  }

  fireRequests(sampleSize)

  function fireRequests(remainingRequest) {
    for (var i = 0; i < Math.min(requestPerSec, remainingRequest); i++) {
      requestFn(requestData, function (startTime, err, data) {
        if (err) errorCount++
        stats.update(Date.now() - startTime)
        total++
        if (total % PRGORESS_UPDATE_INTERVAL === 0) bar.tick()
        if (total >= sampleSize) {
          defer.resolve()
        }
      }.bind(null, Date.now()))
    }
    remainingRequest -= requestPerSec
    if (remainingRequest > 0) {
      setTimeout(fireRequests.bind(null, remainingRequest), 1000)
    }
  }

  return defer.promise
    .then(function () {
      var elapsedTimeSec = (Date.now() - overallStartTime) / 1000
      return {
        latency: stats,
        throughput: sampleSize / elapsedTimeSec,
        errorCount: errorCount
      }
    })
}

/**
 * Test the performance of putItem.
 *
 * @param {number} sampleSize The number of requests to measure
 * @param {number} recordSizeInByte The size of each record. The actual
 *     requests will be slightly bigger than this due to XML overhead.
 */
function writeData(sampleSize, recordSizeInByte) {
  // Create 20 attributes in each record, that their total size
  // will be "recordSizeInByte"
  var str = new Array(Math.round(recordSizeInByte / 20) + 1).join('*')
  var item = {
    TableName: TABLE_NAME,
    Item: {
      hash: {N: '0'},
      range: {S: '@'}
    }
  }
  for (var i = 0; i < 20; i++) {
    item.Item['item' + i] = {S: str}
  }
  return benchmarkFunction(database.putItem.bind(database), item, sampleSize)
}

/**
 * Test the performance of getItem.
 *
 * @param {number} sampleSize The number of requests to measure
 */
function readData(sampleSize) {
  var item = {
    TableName: TABLE_NAME,
    Key: {
      hash: {N: '0'},
      range: {S: '@'}
    }
  }
  return benchmarkFunction(database.getItem.bind(database), item, sampleSize)
}

/**
 * Convert a stats object to a human-readable string.
 *
 * @param {{latency: metrics.Histogram,
 *          throughput: number,
 *          errorCount: number}} stats
 * @return {string}
 */
function statsToString(stats) {
  return util.format('lantecy (ms): mean/std_dev/median %d/%d/%d, throughput (/sec): %d, errors: %d',
      stats.latency.mean().toFixed(2), 
      stats.latency.stdDev().toFixed(2),
      stats.latency.percentiles([0.5])[0.5].toFixed(2),
      stats.throughput.toFixed(2),
      stats.errorCount)
}

/**
 * Create a promise that will create a table if needed.
 *
 * @return {Promise} A promise that will resolve if a table is
 *   created and ready to use when requested.
 */
function createTable() {
  var promise
  if (flags.get('create_table') || flags.get('use_local_dynamo')) {
    promise = Q.nfcall(database.createTable.bind(database), description)
    if (!flags.get('use_local_dynamo')) {
      promise = promise.then(function () {
        console.log('Waiting for the table to be ready in Dynamo')
        // Wait 40 seconds for the table to be ready
        return Q.delay(40000)
      })
    }
  } else {
    promise = Q.resolve()
  }
  return promise
}

/**
 * Create a promise that will delete a table if needed.
 *
 * @return {Promise} A promise that will resolve if a table is
 *   created and ready to use when requested.
 */
function deleteTable() {
  if (flags.get('create_table') || flags.get('use_local_dynamo')) {
    return Q.nfcall(database.deleteTable.bind(database), {TableName: TABLE_NAME})
  } else {
    return Q.resolve()
  }
}

/**
 * Benchmark both putItem and getItem with a given size of record.
 *
 * @param {number} sampleSize The number of requests to measure
 * @param {number} recordSizeInByte The size of each record. The actual
 *     requests will be slightly bigger than this due to XML overhead.
 */
function benchmark(sampleSize, recordSizeInByte) {
  return createTable()
    .then(function () {
      return writeData(sampleSize, recordSizeInByte)
    })
    .then(function (writeStats) {
      console.log('[putItem]', statsToString(writeStats))
      return readData(sampleSize)
    })
    .then(function (readStats) {
      console.log('[getItem]', statsToString(readStats))
      return deleteTable()
    })
    .then(function () {
      process.exit()
    })
    .fail(function (err) {
      console.error(err)
      process.exit(1)
    })
}

console.log('AWS SDK Version', AWS.VERSION)
console.log('Sample Size', flags.get('sample_size'))
console.log('Record Size (byte)', flags.get('record_size'))

benchmark(flags.get('sample_size'), flags.get('record_size'))
