// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Main script for launching AWS DynamoDB Local.
 */

var cp = require('child_process')
var path = require('path')

/**
 * @param {string} databaseDir The location of database files.
 * @param {number} port
 * @return {ChildProcess}
 */
function launch(databaseDir, port) {
  var workingDir = path.resolve(databaseDir)
  var javaDir = path.join(__dirname, '..', 'aws_dynamodb_local')

  var cmd = 'java'
  var args = [
    '-Djava.library.path=' + javaDir,
    '-jar',
    path.join(javaDir, 'DynamoDBLocal.jar'),
    '--port',
    port
  ]
  return cp.spawn(cmd, args, {cwd: workingDir, env: process.env})
}

module.exports = {launch: launch}