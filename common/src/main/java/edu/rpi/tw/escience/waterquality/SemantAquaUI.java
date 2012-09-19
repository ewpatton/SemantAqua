package edu.rpi.tw.escience.waterquality;

import java.util.List;

/**
 * The SemantAquaUI object provides a mechanism for
 * modules to manipulate the UI when it is rendered by
 * the server and sent to the client.
 * @author ewpatton
 *
 */
public interface SemantAquaUI {
	/**
	 * Adds a resource representing a JavaScript file
	 * @param script
	 */
	void addScript(Resource script);
	
	/**
	 * Adds a resource representing a Cascading Stylesheet
	 * @param stylesheet
	 */
	void addStylesheet(Resource stylesheet);
	
	/**
	 * Adds a resource representing an HTML/JSP fragment used
	 * for rendering the display of the Module
	 * @param facet
	 */
	void addFacet(Resource facet);
	
	/**
	 * Lists all of the facets present in this UI object.
	 * @return
	 */
	List<Resource> getFacets();
	
	/**
	 * Lists all of the scripts present in this UI object.
	 * @return
	 */
	List<Resource> getScripts();
	
	/**
	 * Lists all of the stylesheets present in this UI object.
	 * @return
	 */
	List<Resource> getStylesheets();
}
