package com.google.refine.granatumExtension.util;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.StringBufferInputStream;
import java.util.ArrayList;

import org.json.JSONObject;
import org.json.JSONWriter;
import org.openjena.atlas.json.JsonString;


import com.hp.hpl.jena.query.Query;
import com.hp.hpl.jena.query.QueryExecution;
import com.hp.hpl.jena.query.QueryExecutionFactory;
import com.hp.hpl.jena.query.QueryFactory;
import com.hp.hpl.jena.query.QuerySolution;
import com.hp.hpl.jena.query.ResultSet;
import com.hp.hpl.jena.query.ResultSetFormatter;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.ModelFactory;
import com.hp.hpl.jena.sparql.resultset.JSONInput.JSONResultSet;
import com.hp.hpl.jena.util.FileManager;



public class GranatumOntology {
	
	    static Model model;
	    
	    public GranatumOntology(){
	    	this.model=this.readModel();
	    }
		
	    public  Model readModel(){
			 // create an empty model
			 Model model = ModelFactory.createDefaultModel();
			 String inputFileName="/home/gofran/Downloads/tools/2.5-rc1/extensions/granatum/resources/ontologies/1.owl";
			// use the FileManager to find the input file
			 InputStream in = FileManager.get().open( inputFileName );
			if (in == null) {
			    throw new IllegalArgumentException(
			                                 "File: " + inputFileName + " not found");
			}
			// read the RDF/XML file
			model.read(in, null);
			// write it to standard out
			return model;
		}
		
	public  ArrayList<String> getStudyTypes(){
		String queryString = 
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
			"SELECT ?uri " +
			"WHERE {" +
			"      ?uri rdfs:subClassOf <http://granatum.org/schema/Study> . " +
			"      }";

		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		ArrayList<String> studyTypes=new ArrayList<String>();
		while(results.hasNext()){
			 QuerySolution binding = results.nextSolution();                     
			 binding.get("uri");
			 String uri = binding.get("uri").toString();
			studyTypes.add(uri);
		}
		//OutputStream jsonResults = new StringBufferOutputStream();
		// Output query results	
		//ResultSetFormatter.out(System.out, results, query);
		// Important - free up resources used running the query
		//ResultSetFormatter.outputAsJSON(jsonResults, results);
		qe.close();
	 
		return studyTypes;
	}
	
	public  ArrayList<StudyAttribute> getStudyAttributes(String studyuri){
		String queryString = 
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
			"SELECT ?uri ?range " +
			"WHERE {" +
			"      {?uri rdfs:domain <http://granatum.org/schema/Study> ." +
			"	   ?uri rdfs:range ?range .}" +
			"UNION " +
			"	   {?uri rdfs:domain <"+studyuri+"> ." +
			"       ?uri rdfs:range ?range .}" +
			"      }";

		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		ArrayList<StudyAttribute> studyAttributes=new ArrayList<StudyAttribute>();
		while(results.hasNext()){
			QuerySolution binding = results.nextSolution();                      
			StudyAttribute studyAttribute=new StudyAttribute();
			studyAttribute.setAttributeName(binding.get("uri").toString());
			studyAttribute.setAttributeRange(binding.get("range").toString());
			studyAttributes.add(studyAttribute);
		}
		//OutputStream jsonResults = new StringBufferOutputStream();
		// Output query results	
		//ResultSetFormatter.out(System.out, results, query);
		// Important - free up resources used running the query
		//ResultSetFormatter.outputAsJSON(jsonResults, results);
		qe.close();
	 
		return studyAttributes;
	}
	
	
	public static void main(String[] args) {
		GranatumOntology granatumOntology=new GranatumOntology();
		granatumOntology.getStudyTypes();
	}

}
