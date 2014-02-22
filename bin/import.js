// Copyright 2014 A Medium Corporation.

/**
 * @fileoverview This script creates Dynamo tables in DynamoDB Local (a Dynamo
 * db emulator). It reads table description from a given table and creates a
 * a new table based on the description. Optionally, you can also import data
 * from an existing table.
 */

var AWS = require('aws-sdk')
var Q = require('kew')
var flags = require('flags')
var utils = require('../lib/utils')
var ScanStream = require('dynamo-stream').ScanStream
var PutItemStream = require('../lib/PutItemStream')

flags.defineString('source_db_access_key', null, 'The AWS access key of the database to read data from')
flags.defineString('source_db_secret_key', null, 'The AWS secret key of the database to read data from')
flags.defineString('source_db_region', null, 'The AWS region of the database to read data from')
flags.defineString('source_db_end_point', null, 'The end point of the database to read data from')
flags.defineString('source_db_table_name', null, 'The name of the table to read data from')
flags.defineString('dest_db_access_key', null, 'The AWS access key of the DynamoDB Local database to write data to')
flags.defineString('dest_db_region', null, 'The AWS region of the DynamoDB Local database to write data to')
flags.defineString('dest_db_end_point', null, 'The end point of the DynamoDB Local database to write data to')
flags.defineString('dest_db_table_name', null, 'The name of the table to write data to')
flags.defineBoolean('import_data', '', 'Import data after create the table')
flags.parse()

/**
 * The database option.
 *
 * @type {Object}
 */
var sourceDynamoOptions = {
  apiVersion: '2012-08-10',
  accessKeyId: flags.get('source_db_access_key'),
  secretAccessKey: flags.get('source_db_secret_key'),
  region: flags.get('source_db_region')
}
if (flags.get('source_db_end_point')) {
  // If the source database is a local database, we need to
  // set the end point and also disable SSL.
  sourceDynamoOptions.endpoint = flags.get('source_db_end_point')
  sourceDynamoOptions.sslEnabled = false
}

/**
 * The target database option. This is always a local database.
 *
 * @type {Object}
 */
var destDynamoOptions = {
  apiVersion: '2012-08-10',
  endpoint: flags.get('dest_db_end_point'),
  accessKeyId: flags.get('dest_db_access_key'),
  secretAccessKey: '***',
  region: flags.get('dest_db_region'),
  sslEnabled: false
}

/**
 * The AWS database instance for the database that you read data from.
 *
 * @type {AWS.DynamoDB}
 */
var sourceDatabase = new AWS.DynamoDB(sourceDynamoOptions)

/**
 * The AWS database instance for the database that you write data to.
 *
 * @type {AWS.DynamoDB}
 */
var destDatabase = new AWS.DynamoDB(destDynamoOptions)

/**
 * The name of the table you read data from.
 *
 * @type {string}
 */
var sourceTableName = flags.get('source_db_table_name')

/**
 * The name of the table you write data to.
 *
 * @type {string}
 */
var destTableName = flags.get('dest_db_table_name')


Q.nfcall(sourceDatabase.describeTable.bind(sourceDatabase), {TableName: sourceTableName})
  .fail(function (err) {
    console.error('Failed to get table description for', sourceTableName, err)
    process.exit(1)
  })

  .then(function (data) {
    return Q.nfcall(destDatabase.createTable.bind(destDatabase), utils.convertDescriptionForCreation(data, destTableName))
  })
  .fail(function (err) {
    console.error('Failed to create table', destTableName, err)
    process.exit(1)
  })

  .then(function (data) {
    console.log('Created table', destTableName)
    if (!flags.get('import_data')) return Q.resolve()

    var defer = Q.defer()
    var fromStream = new ScanStream(sourceDynamoOptions, sourceTableName)
    var toStream = new PutItemStream(destDynamoOptions, destTableName)
    fromStream.pipe(toStream)

    toStream.on('finish', function () {
      console.log('Finished importing data from %s to %s', sourceTableName, destTableName)
      defer.resolve()
    })

    toStream.on('error', function (err) {
      defer.reject(err)
    })

    return defer.promise
  })
  .fail(function (err) {
    console.error('Failed to import data', sourceTableName, err)
  })
