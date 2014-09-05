// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview The script to launch DynamoDB Local from command line.
 */

var flags = require('flags')
var fs = require('fs')
var localDynamo = require('../lib/launch.js')

flags.defineString('database_dir', '', 'The locaction for databases files')
flags.defineNumber('port', 4567, 'A port to run DynamoDB Local')
flags.parse()

if (!flags.get('database_dir')) {
  console.error('Missing database directory')
  process.exit(1)
}

if (!fs.existsSync(flags.get('database_dir'))) {
  console.error('Database directory does not exist')
  process.exit(1)
}

var childProcess = localDynamo.launch(flags.get('database_dir'), flags.get('port'))
childProcess.stdout.pipe(process.stdout)
childProcess.stderr.pipe(process.stderr)
