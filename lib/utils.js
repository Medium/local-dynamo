// Copyright 2014 A Medium Corporation.

/**
 * @fileoverview Utility functions.
 */

/**
 * Extract the needed information from a given table description to create
 * a new table with the same spec.
 *
 * The table description from the "describeTable" command has more information
 * than we need to create the table, e.g. "CreationDateTime", "ItemCount", etc.
 * The "CreateTable" command will throw errors for unrecognized data.
 *
 * The describTable API: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_DescribeTable.html
 *
 * The createTable API: http://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_CreateTable.html
 *
 * @param {Object} tableDescription
 * @param {string} toTableName
 * @return {Object} An object that can be used to create a new table
 * @constructor
 */
module.exports.convertDescriptionForCreation = function (tableDescription, tableName) {  
  // TODO (Xiao): add code to pick global second index data.
  var tableCreationSpec = {} 
  tableCreationSpec.TableName = tableName
  tableCreationSpec.AttributeDefinitions = tableDescription.Table.AttributeDefinitions
  tableCreationSpec.KeySchema = tableDescription.Table.KeySchema
  tableCreationSpec.ProvisionedThroughput = {ReadCapacityUnits: 1, WriteCapacityUnits: 1}
  if (tableDescription.Table.LocalSecondaryIndexes) {
    // The local secondary index object from "describeTable" command has
    // fields that are not required for creating index, e.g., IndexByteSize
    // and ItemCount. Only the following three are required.
    tableCreationSpec.LocalSecondaryIndexes =
      tableDescription.Table.LocalSecondaryIndexes.map(function (index) {
        return {
          IndexName: index.IndexName,
          KeySchema: index.KeySchema,
          Projection: index.Projection
        }
      })
  }
  return tableCreationSpec
}
