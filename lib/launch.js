// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Main script for launching AWS DynamoDB Local.
 */

var cp = require('child_process')
var path = require('path')

/**
 * An options object:
 *   port: {number} - The port to run on. Required.
 *   dir: {?string=} - The location of database files. Optional Will run in-memory if null.
 *   heap: {?string=} - The amount of heap space, e.g., 512m. Uses JVM memory syntax.
 *       If not specified, uses JVM defaults. See:
 *       http://docs.oracle.com/javase/7/docs/technotes/tools/solaris/java.html
 * @typedef {Object}
 */
var Options;

/**
 * @param {?string|Options} options The options object. For backwards compatibility,
 *     accepts a string as the database dir.
 * @param {=number} port The port. Prefer using the options object.
 * @return {ChildProcess}
 */
function launch(options, port) {
  if (typeof options == 'string') {
    options = {dir: options}
  } else {
    options = options || {}
  }

  options.port = options.port || port

  if (isNaN(options.port)) {
    throw Error('Port required')
  }

  var opts = {
    env: process.env,
    detached: (options.detached || false),
    stdio: (options.stdio || 'ignore')
  }

  var javaDir = path.join(__dirname, '..', 'aws_dynamodb_local')
  var libDir = path.join(javaDir, 'DynamoDBLocal_lib')
  var cmd = 'java'

  var args = [
    '-Djava.library.path=' + libDir,
    '-server',
  ]

  if (options.heap) {
    args.push('-Xmx' + options.heap)
  }

  if (options.sharedDb) {
      args.push('-sharedDb')
  }

  args.push(
      '-jar',
      path.join(javaDir, 'DynamoDBLocal.jar'),
      '--port',
     options.port)

  if (options.cors) {
    var origins = options.cors
    
    if (Array.isArray(origins)) {
      origins = origins.join(',')
    }

    args.push('--cors', origins)
  }

  if (options.dir) {
    opts.cwd = path.resolve(options.dir)
  } else {
    args.push('--inMemory')
  }

  if (options.sharedDb) {
    args.push('-sharedDb')
  }

  return cp.spawn(cmd, args, opts)
}

module.exports = {launch: launch}
