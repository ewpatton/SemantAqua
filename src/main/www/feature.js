/**
 * @requires visitor.js
 * @class A feature that can be added to a portal, primarily used to represent different data facets.
 * @author ewpatton
 */
var Feature = new Interface("Feature", ["getLabel","getImage","render","setEnabled","isEnabled","setName","getName"],
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
/**
 * @name Feature.prototype.setEnabled
 * @function Sets whether or not the interface for this Feature is enabled
 * @param {boolean} enable true to enable the feature, false to disable
 */
/**
 * @name Feature.prototype.isEnabled
 * @function Returns the current state of the feature
 * @returns {boolean} true if the feature is enabled, otherwise false
 */
/**
 * @name Feature.prototype.setName
 * @function Sets the name of the feature, usually used for features as part of &lt;form&gt; elements
 * @param {String} name The name for the object. It should be a valid NCNAME for the purposes of naming a form element
 */
/**
 * @name Feature.prototype.getName
 * @function Gets the current name of this feature.
 * @returns {String} The name of the feature, if any.
 */