/**
 * Defines a new Interface and its methods.
 * @author ewpatton
 * @class This represents an Interface that can be used in a similar way to 
 * interfaces available in languages such as C++ and Java. Interfaces are
 * defined in the following way:
 * 
 * <pre class="code">
 * var Person = new Interface('Person', ['getName', 'setName'], [Agent]);
 * </pre>
 *
 * @param {String} name A name for the interface, primarily used for error 
 * messages.
 * @param {String[]} methods A list of method names that must be supplied on 
 * @param {Interface[]} supers Optional interfaces to extend.
 * an implementation of this interface.
 * @throws {Error} If the passed arguments are invalid.
 */
var Interface = function(name, methods, supers) {
  if(arguments.length < 2) {
    throw new Error("Interface constructor called with "+arguments.length+
		    " arguments, expected at least 2.");
  }
  this.name = name;
  this.methods = {};
  for(var i=0, len = methods.length; i < len; i++) {
    if(typeof methods[i] !== 'string') {
      throw new Error("Interface constructor expects method names to be "+
		      "passed as a string.");
    }
    this.methods[methods[i]] = [this.name];
  }
  if(supers) {
    for(var i=0, len=supers.length;i<len;i++) {
      var s = supers[i];
      for(var m in s.methods) {
	if(this.methods[m] === undefined) this.methods[m] = [];
	if(typeof this.methods[m].push === 'function') {
	  this.methods[m].push(s.name);
	}
      }
    }
  }
};

/**
 * Ensures that a given object provides methods as declared by the interfaces 
 * given.
 * For example:
 * <pre class="code">
 * Interface.ensureImplements(this, Person, Form);
 * </pre>
 * @param {Object} object
 * @param {Interface} ...
 * @throws {Error} If the specified object does not implement the given
 * interfaces.
 */
Interface.ensureImplements = function(object/**, ...*/) {
  if(arguments.length < 2) {
    throw new Error("Function Interface.ensureImplements called with "+
		    arguments.length+" arguments, expected at least 2.");
  }

  for(var i=1, len=arguments.length; i<len; i++) {
    var interface = arguments[i];
    if(interface.constructor !== Interface) {
      throw new Error("Function Interface.ensureImplements expects its arguments to be of type Interface");
    }
  }

  for(var method in interface.methods) {
    if(!object[method] || typeof object[method] !== 'function') {
      var str = interface.methods[method].join(", ");
      throw new Error("Function Interface.ensureImplements object does not "+
		      "implement the '"+interface.name+"' interface. Method '"+
		      method+"' declared by the interfaces ["+
		      interface.methods[method]+"] was not found.");
    }
  }
};

Object.prototype.implements = function() {
  if(arguments.length == 0) {
    throw new Error("Function Object.implements expects more than one argument of type interface");
  }
  var newargs = [this];
  for(var i=0,len=arguments.length;i<len;i++) {
    if(arguments[i].constructor !== Interface) {
      throw new Error("Function Object.implements expects its arguments to be of type Interface");
    }
    newargs.push(arguments[i]);
  }
  try {
    Interface.ensureImplements.apply(Interface, newargs);
    return true;
  }
  catch(e) {
    return false;
  }
}
