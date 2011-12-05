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



public class GranatumOntologyManager {
	
	    static Model model;
	    
	    public GranatumOntologyManager(){
	    	this.model=this.readModel();
	    }
		
	    public  Model readModel(){
			 // create an empty model
			 Model model = ModelFactory.createDefaultModel();
			 String inputFileName="/extentions/granatum/resources/ontologies/Granatum-02-12-11.owl";
			
			// use the FileManager to find the input file
			 InputStream in =  this.getClass().getResourceAsStream("/ontologies/Granatum-02-12-11.owl");
			if (in == null) {
			    throw new IllegalArgumentException(
			                                 "File: " + inputFileName + " not found");
			}
			// read the RDF/XML file
			model.read(in, null);
			// write it to standard out
			return model;
		}
		
	public  ArrayList<Study> getStudyTypes(){
		String queryString = 
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
			"SELECT ?uri ?label " +
			"WHERE {" +
			"      ?uri rdfs:subClassOf <http://granatum.org/schema/Study> . " +
			"	   ?uri rdfs:label ?label."+
			"      }";

		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		ArrayList<Study> studyTypes=new ArrayList<Study>();
		while(results.hasNext()){
			 QuerySolution binding = results.nextSolution();                     
			 binding.get("uri");
			 Study study=new Study();
			 study.setStudyLabel(binding.get("label")!=null? binding.get("label").toString():binding.get("uri").toString().substring(binding.get("uri").toString().lastIndexOf("/")+1));
			 study.setStudyURI(binding.get("uri").toString());
			 studyTypes.add(study);
		}
		//OutputStream jsonResults = new StringBufferOutputStream();
		// Output query results	
		//ResultSetFormatter.out(System.out, results, query);
		// Important - free up resources used running the query
		//ResultSetFormatter.outputAsJSON(jsonResults, results);
		qe.close();
	 
		return studyTypes;
	}
	
	public  ArrayList<StudyMetadataAttribute> getStudyAttributes(String studyuri){
		String queryString = 
			"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
			"PREFIX owl:  <http://www.w3.org/2002/07/owl#> "+
			"SELECT ?uri ?range ?type ?label " +
			"WHERE {" +
			"      {?uri rdfs:domain <http://granatum.org/schema/Study> ." +
			"	   ?uri rdfs:range ?range ." +
			"		?uri rdfs:label ?label."+
			"	    OPTIONAL {?uri a ?type. } "+
			"}" +
			"UNION " +
			"	   {?uri rdfs:domain <"+studyuri+"> ." +
			"       ?uri rdfs:range ?range ." +
			"		?uri rdfs:label ?label."+
			"	   OPTIONAL {?uri a ?type. }"+
			"      }}";

		Query query = QueryFactory.create(queryString);

		// Execute the query and obtain results
		QueryExecution qe = QueryExecutionFactory.create(query, model);
		ResultSet results = qe.execSelect();
		ArrayList<StudyMetadataAttribute> studyAttributes=new ArrayList<StudyMetadataAttribute>();
		while(results.hasNext()){
			QuerySolution binding = results.nextSolution();                      
			StudyMetadataAttribute studyAttribute=new StudyMetadataAttribute();
			studyAttribute.setAttributeURI(binding.get("uri").toString());
			studyAttribute.setLabel(binding.get("label")!=null? binding.get("label").toString():binding.get("uri").toString().substring(binding.get("uri").toString().lastIndexOf("#")+1));
			studyAttribute.setAttributeRange(binding.get("range").toString());
			if(binding.get("type")!=null){
			studyAttribute.setInputType(binding.get("type").toString());
			}
							
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
		GranatumOntologyManager granatumOntology=new GranatumOntologyManager();
		granatumOntology.getStudyTypes();
	}

}
