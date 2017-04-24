# A Node.js wrapper of [AWS DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.html)

[![Build Status](https://travis-ci.org/Medium/local-dynamo.svg?branch=master)](https://travis-ci.org/Medium/local-dynamo)

This is a thin wrapper of the [AWS DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.html).
You can start the DynamoDB Local within a Node.js program and easily
specify where the database files should be.

Release notes can be found at http://aws.amazon.com/releasenotes/SDK/JavaScript

## Installing

```sh
npm install local-dynamo
```

## Usage

From command line:

```bash
$ node bin/launch_local_dynamo.js --database_dir=/database/dir --port=4567
```

or inside a Node.js application:

```javascript
localDynamo = require('local-dynamo')
localDynamo.launch('/database/dir', 4567)
```

If you want to run DynamoDB Local in memory, pass in `null`:

```javascript
localDynamo = require('local-dynamo')
localDynamo.launch(null, 4567)
```

## Configuration
`launch` allows for additional options
```javascript
localDynamo = require('local-dynamo')
localDynamo.launch({
  port: 4567,
  sharedDb: true,
  heap: '512m'
})
```

| option | description | default |
| --- | --- | --- |
| port | The port number that DynamoDB will use to communicate with your application | 8000 |
| detached | Prepare child to run independently of its parent process | false |
| stdio | Configure the pipes that are established between the parent and child process | 'ignore' |
| heap | Heap size | null |
| sharedDb | DynamoDB will use a single database file, instead of using separate files for each credential and region | null |
| dir | The directory where DynamoDB will write its database file | null (default to inMemory) |

## AWS DynamoDB Local Versions

Here is a list of the versions DynamoDB Local that `local-dynamo` uses.

 * `0.0.1` -- `dynamodb_local_2013-09-12`
 * `0.0.2` -- `dynamodb_local_2014-01-08`
 * `0.0.3` -- `dynamodb_local_2014-04-24`
 * `0.0.4` -- `dynamodb_local_2014-10-07`
 * `0.0.5` -- `dynamodb_local_2015-01-27`
 * `0.0.6` -- `dynamodb_local_2015-04-27`
 * `0.2.0` -- `dynamodb_local_2016-01-05`
 * `0.3.0` -- `dynamodb_local_2016-05-17`
 * `0.5.0` -- `dynamodb_local_2017-01-24`
