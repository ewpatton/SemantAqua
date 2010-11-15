package edu.rpi.tw.eScience.WaterQualityPortal.WebService;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.query.ResultSetFormatter;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.rdf.model.StmtIterator;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import org.mindswap.pellet.jena.PelletReasonerFactory;


public class WaterAgentInstance implements HttpHandler {
	
	public Map<String,String> parseRequest(HttpExchange arg0) throws IOException
	{
		HashMap<String,String> result = new HashMap<String, String>();
		String query = arg0.getRequestURI().getQuery();
		//parse request
		String [] request=query.split("&");
		
		
		for(int i=0;i<request.length;i++) {
			String[] pieces = request[i].split("=");
			result.put(pieces[0], java.net.URLDecoder.decode(pieces[1],"UTF-8"));
		}
		return result;
	}

	public void handle(HttpExchange arg0) throws IOException {
		arg0.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
		try {
			//get query string
			Map<String,String> params = parseRequest(arg0);
			String countyCode = params.get("countyCode");
			String stateCode = params.get("stateCode");
			String state = params.get("state");
			String zip = params.get("zip");
			String queryString=params.get("query");
			
			//load ontology model
			Model owlModel = ModelFactory.createOntologyModel(PelletReasonerFactory.THE_SPEC);
			Model pmlModel = ModelFactory.createDefaultModel();
			owlModel.read("http://tw2.tw.rpi.edu/zhengj3/demo/cleanwater.owl");
			try {
				owlModel.read("http://was.tw.rpi.edu/water/rdf/"+state+"-regulations-owl.rdf");
				pmlModel.read("http://was.tw.rpi.edu/water/rdf/"+state+"-regulations-pml.rdf");
			}
			catch(Exception e) {
				System.err.println("Unable to find regulations for state "+state);
			}
			Model model = ModelFactory.createUnion(owlModel, pmlModel);
			
			//get query result in xml format
			String response = getQueryResult(model,queryString);
			//String response = arg0.getRequestURI().getQuery();
			//send response back
			arg0.sendResponseHeaders(200, response.length());
			OutputStream os = arg0.getResponseBody();
			os.write(response.getBytes());
			os.flush();
			os.close();
		} catch(Exception e) {
			String stackTrace = e.getStackTrace().toString();
			arg0.sendResponseHeaders(500, stackTrace.length());
			arg0.getResponseBody().write(stackTrace.getBytes("UTF-8"));
			arg0.getResponseBody().close();
		}
	}

	public String getQueryResult(Model model, String queryString)
	{
		QueryExecution qe = QueryExecutionFactory.create(queryString, model);
		ResultSet queryResults = qe.execSelect();
		
		String result = ResultSetFormatter.asXMLString(queryResults);

		qe.close();
		
		return result;
	}

	public void listStatements(Model model)
	{
		StmtIterator iter = model.listStatements();
		
		if (iter.hasNext()) {
		    while (iter.hasNext()) {
		        System.out.println("  " + iter.nextStatement().toString());
		    }
		} else {
		    System.out.println("No vcards were found in the database");
		}
	}
	}
