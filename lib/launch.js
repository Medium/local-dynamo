// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Main script for launching AWS DynamoDB Local.
 */

var cp = require('child_process')
var path = require('path')

/**
 * @param {?string} databaseDir The location of database files. Will run in memory if null.
 * @param {number} port
 * @return {ChildProcess}
 */
function launch(databaseDir, port) {
  var opts = {env: process.env}
  var javaDir = path.join(__dirname, '..', 'aws_dynamodb_local')
  var libDir = path.join(javaDir, 'DynamoDBLocal_lib')
  var cmd = 'java'

  var args = [
    '-Djava.library.path=' + libDir,
    '-jar',
    path.join(javaDir, 'DynamoDBLocal.jar'),
    '--port',
    port
  ]

  if (databaseDir === null) {
    args.push('--inMemory')
  } else {
    opts.cwd = path.resolve(databaseDir)
  }

  return cp.spawn(cmd, args, opts)
}

module.exports = {launch: launch}
