README
========

For an overview of DynamoDB Local please refer to the documentation at http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html


Enhancements in this release
-----------------------------

http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html

* Add support for document storage and retreival.
* Add support for expressions.


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
