/**
 * Interface representing the API for the SemantAqua backend server.
 * @class
 * @requires queryfactory.js
 * @author ewpatton
 * @see QueryFactory
 */
var SemantAquaService = new Interface("SemantAquaService",["getSources","getWaterTypes","getCharacteristics","getHealthEffects"],[QueryFactory]);

/**
 * @function Queries the SemantAqua service and obtains a list of data sources
 * from the server's metadata set.
 * @name SemantAquaService.prototype.getSources
 * @returns {LabelledURI[]} An array of LabelledURI objects representing the 
 * sources available on the server.
 */
/**
 * @function Queries the SemantAqua service and obtains a list of water classes
 * from the server's metadata set.
 * @name SemantAquaService.prototype.getWaterTypes
 * @returns {LabelledURI[]} An array of LabelledURI objects representing the 
 * water classes available on the server.
 */
/**
 * @function Queries the SemantAqua service and obtains a list of water
 * characteristics from the server's metadata set.
 * @name SemantAquaService.prototype.getCharacteristics
 * @param {String} zip ZIP Code used to generate the water characteristics list
 * @throws {InvalidZIPCodeException} If the ZIP code is invalid
 * @returns {LabelledURI[]} An array of LabelledURI objects representing the
 * characteristics available on the server.
 */
/**
 * @function Queries the SemantAqua service and obtains a list of health 
 * effects from the server's metadata set.
 * @name SemantAquaService.prototype.getHealthEffects
 * @param {String} zip ZIP Code used to generate the health effects list
 * @throws {InvalidZIPCodeException} If the ZIP code is invalid
 * @returns {HealthEffect[]} An array of LabelledURI objects representing the 
 * health effects available on the server.
 */
/**
 * @function Creates a Query object for this service
 * @name SemantAquaService.prototype.createQuery
 * @see QueryFactory#createQuery
 * @returns {SemantAquaService.Query} A Query object used to build a RESTful
 * query to this service.
 */
/**
 * @class Represents a RESTful AJAX query to the SemantAqua service
 * @name SemantAquaService.Query
 * @see QueryFactory.Query
 * @author ewpatton
 */
SemantAquaService.Query = new Interface("SemantAquaService.Query",["getZIPCode","setZIPCode","getSources","setSources","getWaterTypes","setWaterTypes","getCharacteristics","setCharacteristics","getHealthEffects","setHealthEffects","getLimit","setLimit","getOffset","setOffset"],[QueryFactory.Query]);
