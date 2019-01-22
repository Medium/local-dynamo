#!/usr/bin/env node
// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview The script to launch DynamoDB Local from command line.
 */

var flags = require('flags')
var localDynamo = require('../lib/launch.js')

flags.defineString('database_dir', '', 'The location for databases files. Run in memory if omitted.')
flags.defineNumber('port', 4567, 'A port to run DynamoDB Local')
flags.defineBoolean('sharedDb', false, 'Use a single database file, instead of separate files for each credential and region')
flags.parse()

var childProcess = localDynamo.launch({
  dir: flags.get('database_dir') || null,
  sharedDb: flags.get('sharedDb'),
  stdio: 'pipe'
}, flags.get('port'))
childProcess.stdout.pipe(process.stdout)
childProcess.stderr.pipe(process.stderr)

childProcess.on('error', function (e) {
  if (e.code === 'ENOENT') {
  	console.error('Failed to start DynamoDB Local. Maybe because the database directory does not exist.')
  } else {
  	console.error('Failed to start DynamoDB Local. Error:', e.message)
  }
})
