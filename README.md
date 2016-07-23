# A Node.js wrapper of [AWS DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.html)

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

If you want DynamoDB to use a single file instead of using separate files for each credential and region:

```javascript
localDynamo = require('local-dynamo')
localDynamo.launch({shared: true}, 4567)
```

This will run DynamoDB in memory and all clients will be able to access the same tables

### Custom configurations

If you want to specify the port, directory, enable sharing, control the heap size of the DynamoDB instance then
you can do the following (runs DynamoDB on port 8080 with a heap size of 512 MB)

```javascript
localDynamo = require('local-dynamo')
let options = {
    shared: true,
    dir: "/valid/database/directory",
    port: 8080,
    heap: '512m'
};
localDynamo.launch()
```

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
