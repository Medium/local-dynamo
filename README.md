# A Node.js wrapper of [AWS DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.html)

This is a thin wrapper of the [AWS DynamoDB Local](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.html).
You can start the DynamoDB Local within a Node.js program and easily
specify where the database files should be.

Release notes can be found at http://aws.amazon.com/releasenotes/SDK/JavaScript

## Installing

```sh
npm install local-dynamo
```

TODO: check DynamoDB Local license and register in NPM

## Usage

From command line:

```bash
$ node launch.js --database_dir=/database/dir --port=4567
```

or inside a Node.js application:

```javascript
localDynamo = require('local-dynamo')
localDynamo.launch('/database/dir', 4567)
```
