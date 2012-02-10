/**
 * @requires interface.js
 * @class Represents a visitor in the Visitor pattern.
 * @author ewpatton
 */
var Visitor = new Visitor("Visitor", ["visit"]);
/**
 * @name Visitor.prototype.visit
 * @function Causes the visitor object to evaluate itself using the specified visitee
 * @param {Visitee} object An object to visit
 */

/**
 * @requires interface.js
 * @class Represents a visitee in the Visitor pattern.
 * @author ewpatton
 */
var Visitee = new Visitee("Visitee", ["accept"]);
/**
 * @name Visitee.prototype.accept
 * @function Requests that the specified visitor should visit this object
 * @param {Visitor} visitor A visitor object to accept
 */