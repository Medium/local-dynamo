README
========

For an overview of DynamoDB Local please refer to the documentation at http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html


Enhancements in this release
-----------------------------

http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html

* Add support for online indexing

Note the following difference in DynamoDBLocal:

* Local’s exception messages may differ from those returned by the service. 



Running DynamoDB Local (There are two new command line options available for running DynamoDB Local)
---------------------------------------------------------------

java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar [-port <port-no.>] [-inMemory] [-dbPath <path>]

Available Options:
 -dbPath <path>                Specify the location of your database file. Default is
                               the current directory.
 -inMemory                     When specified, DynamoDB Local will run in memory.
 -port <port-no.>              Specify a port number. Default is 8000
 -help                         Display DynamoDB Local usage and options.
 -delayTransientStatuses       When specified, DynamoDB Local will introduce delays to hold various transient table and index statuses so that it simulates actual service more closely. Currently works only for CREATING and DELETING online index statuses.
 -optimizeDbBeforeStartup      Optimize the underlying backing store database tables before starting up the server.

Note that -inMemory and -dbPath options cannot be used together.
Note that -optimizeDbBeforeStartup and -dbPath options should always be used together.
