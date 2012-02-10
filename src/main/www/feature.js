/**
 * @requires interface.js
 * @requires visitor.js
 * @class A feature that can be added to a portal, primarily used to represent different data facets.
 * @author ewpatton
 */
var Feature = new Interface("Feature", ["getLabel","getImage","render"],
			    [Visitor]);
/**
 * @name Feature.prototype.getLabel
 * @function Gets the label for the Feature
 * @returns {String} A label to be used to display this feature
 */
/**
 * @name Feature.prototype.getImage
 * @function Gets an href for an img tag for menus
 * @returns {String} A URI for an image
 */
/**
 * @name Feature.prototype.render
 * @function Renders the feature in the DOM
 * @param {Object} dom DOM element used to attach a feature to the display
 */
