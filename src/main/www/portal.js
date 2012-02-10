/**
 * @requires interface.js
 * @class A basic description of a Portal object composed of a number of features. Once it has been assembled, a Portal should be started using the {@link Portal.run} function.
 * @author ewpatton
 */
var Portal = new Interface("Portal", ["run","addFeature","removeFeature"],
			   [Demo]);
/**
 * @name Portal.prototype.run
 * @function
 * @param {Object} container A DOM object where the Portal should instantiate itself.
 */
/**
 * @name Portal.prototype.addFeature
 * @function Adds a feature to the Portal
 * @paral {Feature} feature The feature to add
 */
/**
 * @name Portal.prototype.removeFeature
 * @function Removes a feature from the Portal interface
 * @param {Feature} feature The feature to remove
 */