/**
 * @requires feature.js
 * @class A facet that displays its options as check boxes.
 * @author ewpatton
 */
var CheckboxFacet = new Interface("CheckboxFacet",["setMin","getMin","setMax","getMax","setOptionEnabled","isOptionEnabled"],[Feature]);

/**
 * @name CheckboxFacet.prototype.setMin
 * @function Sets the minimum number of checked items required for the facet to be valid. This can be treated like an owl:minCardinality restriction.
 * @param {int} min The number of minimum checked elements
 */
/**
 * @name CheckboxFacet.prototype.getMin
 * @function Returns the minimum number of elements that need to be checked for the facet to be valid.
 * @returns {int} Minimum number of required elements
 */
/**
 * @name CheckboxFacet.prototype.setMax
 * @function Sets the maximum number of checked items requierd for the facet to be valid. This can be treated like an owl:maxCardinality restriction.
 * @param {int} max The number of maximum checked elements
 */
/**
 * @name CheckboxFacet.prototype.getMax
 * @function Returns the maximum number of elements that need to be checked for this facet to be valid.
 * @returns {int} Maximum number of required elements
 */
/**
 * @name CheckboxFacet.prototype.setOptionEnabled
 * @function Sets whether or not an option in the facet is enabled
 * @param {int} index Index of the option to enable or disable
 * @param {boolean} enable true to enable the option, false to disable
 */
/**
 * @name CheckboxFacet.prototype.isOptionEnabled
 * @function Returns whether or not an option in the facet is enabled
 * @param {int} index Index of the option to check
 * @returns {boolean} true if the option is enabled, false otherwise
 */