/**
 * @requires interface.js
 * @class Generates a new Query object.
 * @author ewpatton
 */
var QueryFactory = new Interface("QueryFactory",["createQuery"]);
/**
 * @function Creates a new Query object.
 * @name QueryFactory.prototype.createQuery
 * @returns {QueryFactory.Query}
 */
/**
 * @class Represents a generic Query object to be executed
 * @name QueryFactory.Query
 * @author ewpatton
 */
QueryFactory.Query = new Interface("Query",["execute"]);
/**
 * @function Executes the query.
 * @name QueryFactory.Query.prototype.execute
 * @param {Function} callback Optional callback used to make an asynchronous
 * query.
 * @returns {Object} An object representing the results of the query.
 */