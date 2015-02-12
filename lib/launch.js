// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Main script for launching AWS DynamoDB Local.
 */

var cp = require('child_process')
var path = require('path')

/**
 * @param {string} databaseDir The location of database files.
 * @param {number} port
 * @param {boolean} inMemory if true, use --inMemory flag
 * @return {ChildProcess}
 */
function launch(databaseDir, port, inMemory) {
  var workingDir = path.resolve(databaseDir)
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

  if (inMemory === true) {
    args.push('--inMemory')
  }

  return cp.spawn(cmd, args, {cwd: workingDir, env: process.env})
}

module.exports = {launch: launch}
