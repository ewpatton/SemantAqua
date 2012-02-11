/**
 * @class
 * @author ewpatton
 * @param {String} name The name of the class
 * @param {Object} options An optional structure
 * @param {Class} options.extends An instance of Class.
 * @param {Interface|Interface[]} options.implements An Interface or an array of Interfaces.
 * @param {Function|Object} proto A constructor function or prototype object for the class.
 */
var Class = function(name) {
  var _super = null;
  var _interfaces = null;
  var _constructor = null;
  var _proto = null;

  if(arguments.length == 3 && arguments[1] != null) {
    if(arguments[1]["extends"] !== undefined) {
      _super = arguments[1]["extends"];
    }
    if(arguments[1]["implements"] !== undefined) {
      _interfaces = arguments[1]["implements"];
      if(typeof(_interfaces) === 'object') {
	if(_interfaces.prototype.constructor == Interface) {
	  _interfaces = [_interfaces];
	}
	if(_interfaces.length === undefined) {
	  throw new Error("Expected 'implements' to provide an Interface or an array");
	}
      }
      else {
	throw new Error("Expected 'implements' to provide an Interface or an array");
      }
    }
    if(typeof(arguments[2]) === 'function') {
      _constructor = arguments[2];
    }
    else if(typeof(arguments[2]) === 'object') {
      _proto = arguments[2];
      _constructor = _proto.constructor;
    }
    else {
      throw new Error("Expected argument 3 to be of type Object or Function");
    }
  }
  else if(arguments.length == 2 || (arguments.length == 3 && arguments[1] == null) {
    if(typeof(arguments[1]) === 'function') {
      _constructor = arguments[1];
    }
    else if(typeof(arguments[1]) === 'object') {
      _proto = arguments[1];
      _constructor = _proto.constructor;
    }
    else {
      throw new Error("Expected argument 2 to be of type Object or Function");
    }
  }
  else {
    throw new Error("Class expects at least 2 and at most 3 arguments");
  }

  var ret = function() {
    this.superClass = _super.prototype;
    for(var method in _super.prototype) {
      this[method] = _super.prototype[method];
    }
    try {
      _constructor.apply(this, arguments);
    }
    catch(e) {
      window.console.log(e);
    }
    if(!this.implements(_interfaces)) {
      throw new Error("Attempting to instantiate an instance of '"+name+"', but it is abstract.");
    }
  };
  ret.name = name;
  ret.prototype = _proto;
  return ret;
};
