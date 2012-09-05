package edu.rpi.tw.escience.waterquality.query;

import java.util.Set;

/**
 * The Query interface defines how modules construct
 * SPARQL queries so that multiple modules can change
 * the conditions on a shared query.
 * 
 * @author ewpatton
 *
 */
public interface Query extends GraphComponentCollection {

	/**
	 * Base URI used to represent variables and blank nodes in the SPARQL query
	 */
	String VAR_NS = "http://aquarius.tw.rpi.edu/projects/semantaqua/data-source/query-variable/";
	
	/**
	 * Specifies the various types of queries supported
	 * by the Query engine.
	 * @author ewpatton
	 *
	 */
	enum Type {
		SELECT,
		CONSTRUCT,
		DESCRIBE,
		ASK
	}
	
	/**
	 * Gets the GraphComponentCollection associated with this query
	 * if it is a SPARQL CONSTRUCT query.
	 * @return If getType() == Type.CONSTRUCT, returns the GraphComponentCollection
	 * representing the first portion of the CONSTRUCT query before the WHERE clause.
	 * Otherwise, returns null.
	 */
	GraphComponentCollection getConstructComponent();

	/**
	 * Gets a subcomponent for the query that represents
	 * a named graph.
	 * @param uri The named graph to query against
	 * @return
	 */
	NamedGraphComponent getNamedGraph(String uri);
	
	/**
	 * Creates a union graph component for this query
	 * @return
	 */
	UnionComponent createUnion();
	
	/**
	 * Creates an optional graph component for this query
	 * @return
	 */
	OptionalComponent createOptional();
	
	/**
	 * Gets an existing variable for use in this Query
	 * @param uri
	 * @return
	 */
	Variable getVariable(String uri);
	
	/**
	 * Creates a variable for use in this Query
	 * @param uri
	 * @return
	 */
	Variable createVariable(String uri);
	
	/**
	 * Creates a blank node for use in this Query
	 * @return
	 */
	BlankNode createBlankNode();
	
	/**
	 * Sets the type of SPARQL query to be executed
	 * @param type
	 */
	void setType(Type type);
	
	/**
	 * Gets the type of SPARQL query to be executed
	 * @return
	 */
	Type getType();
	
	/**
	 * Adds a FROM clause to the SPARQL query
	 * @param uri
	 */
	void addFrom(String uri);
	
	/**
	 * Gets the list of FROM clauses in the SPARQL query
	 * @return
	 */
	Set<String> getFrom();
	
	/**
	 * Adds a FROM NAMED clause to the SPARQL query
	 * @param uri
	 */
	void addFromNamed(String uri);
	
	/**
	 * Gets the list of FROM NAMED clauses in the SPARQL query
	 * @param uri
	 */
	Set<String> getFromNamed();
	
	/**
	 * Gets a QueryResource object representing
	 * the specific URI
	 * @param uri
	 * @return
	 */
	QueryResource getResource(String uri);
	
	/**
	 * Sets the collection of variables used in SELECT queries. Passing
	 * null will result in a SELECT *
	 * @param object
	 */
	void setVariables(Set<Variable> object);
	
	/**
	 * Gets the collection of variables used in SELECT queries.
	 * @return
	 */
	Set<Variable> getVariables();
}
