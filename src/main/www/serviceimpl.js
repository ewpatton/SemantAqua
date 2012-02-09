/**
 * 
 * @class Acts as an interface between the client browser and the SemantAqua 
 * web service.
 *
 * @param {String} path Optional path representing the base URL of the service
 * @throws {Error} If a path to a SemantAqua service is not provided.
 * @author ewpatton
 */
function SemantAquaServiceImpl(path) {
  if(!path) throw new Error("You must specify a path to a SemantAqua web service");
  this.path = path;
}

