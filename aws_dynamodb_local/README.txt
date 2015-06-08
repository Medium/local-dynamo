README
========

For an overview of DynamoDB Local please refer to the documentation at http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Tools.DynamoDBLocal.html



Release Notes
-----------------------------

2015-04-27_1.0

  * Add support for KeyConditionExpression and attribute_type and size operators

  * http://aws.amazon.com/releasenotes/Amazon-DynamoDB/5140394583334300

  * Updated JS Shell templates to use Expression Language

Note the following difference in DynamoDBLocal:

* Local's exception messages may differ from those returned by the service. 



Running DynamoDB Local
---------------------------------------------------------------

java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar [options]

For more information on available options, run with the -help option:
  java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -help
