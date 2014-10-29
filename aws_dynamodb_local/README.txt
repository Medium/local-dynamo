README
========

For an overview of DynamoDB Local please refer to the documentation at http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html


Enhancements in this release 
-----------------------------

* Support for Query filters (http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html)
* Support for conjunction operator 'OR' in Scan filter (http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/QueryAndScan.html)
* Support for improved conditional requests in PUT, UPDATE and DELETE requests. Updated documentation below
** http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html
** http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateItem.html
** http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DeleteItem.html
* Bug fix in GSI query when projection type is ALL.

Running DynamoDB Local (has not changed from previous release)
---------------------------------------------------------------

java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar [-port <port-no.>] [-inMemory] [-dbPath <path>]

Available Options:
 -dbPath <path>     Specify the location of your database file. Default is
                    the current directory.
 -inMemory          When specified, DynamoDB Local will run in memory.
 -port <port-no.>   Specify a port number. Default is 8000
 -help              Display DynamoDB Local usage and options.

Note that -inMemory and -dbPath options cannot be used together.
