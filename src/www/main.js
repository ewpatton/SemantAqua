/**
 * Provides the core of the SemantAqua portal application by acting as a 
 * controller between the HTML views and the backend server providing the data
 * model.
 * @class
 * @author ewpatton
 */
var SemantAquaPortal = function() { // implements Demo, Portal
  
};

var app = new SemantAquaPortal();

(function() {
  var pos = window.location.href.indexOf("localhost");
  if(pos > 0 && pos <= 8) {
    Interface.ensureImplements(app, Demo, Portal);
  }
})();

app.run();