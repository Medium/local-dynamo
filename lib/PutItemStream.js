// Copyright 2014 A Medium Corporation.

/**
 * @fileoverview A writable stream that put records into a Dynamo table.
 */

var stream = require('stream')
var util = require('util')
var dynamite = require('dynamite')

/**
 *
 * @param {Object} toDatabaseOptions
 * @param {string} toTableName
 * @constructor
 */
function PutItemStream(databaseOptions, tableName) {
  stream.Writable.call(this, {objectMode: true})
  this._db = new dynamite.Client(databaseOptions)
  this._tableName = tableName
}
util.inherits(PutItemStream, stream.Writable)

/** @override */
PutItemStream.prototype._write = function (chunk, encoding, callback) {
  this._db.putItem(this._tableName, chunk)
    .execute()
    .then(function (data) {
      callback()
    })
    .fail(function (err) {
      console.error(err)
      callback(err)
    })
}

module.exports = PutItemStream
