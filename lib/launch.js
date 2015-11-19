// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Main script for launching AWS DynamoDB Local.
 */

var cp = require('child_process')
var path = require('path')
var download = require('./download')

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
function launch(options, port, callback) {
  if (typeof port == 'function') {
    callback = port
    port = null
  }

  if (typeof options == 'string') {
    options = {dir: options}
  } else {
    options = options || {}
  }

  options.port = options.port || port

  if (isNaN(options.port)) {
    throw Error('Port required')
  }

  download(options.version, function(err, info){
    if (err) return callback(err)

    var opts = {
      env: process.env,
      detached: (options.detached || false),
      stdio: (options.stdio || 'ignore')
    }

    var args = [
      '-Djava.library.path=' + info.lib,
      '-server',
    ]

    if (options.heap) {
      args.push('-Xmx' + options.heap)
    }

    args.push('-jar', info.jar, '--port', options.port)

    if (options.dir) {
      opts.cwd = path.resolve(options.dir)
    } else {
      args.push('--inMemory')
    }

    callback(null, cp.spawn('java', args, opts))
  })
}

module.exports = {launch: launch}
