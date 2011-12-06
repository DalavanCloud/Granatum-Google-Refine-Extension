package com.google.refine.granatumExtension.commands;

import java.io.BufferedInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.Serializable;
import java.io.StringWriter;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONWriter;

import com.google.refine.ProjectManager;
import com.google.refine.ProjectMetadata;
import com.google.refine.commands.Command;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Project;
import com.google.refine.operations.OperationRegistry;
import com.google.refine.process.Process;
import com.google.refine.util.ParsingUtilities;

public class ApplyGranatumRDFOperationsCommand extends Command {
	
	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Project project = getProject(request);
		String jsonString = getGranatumOperationFile();
	
		try {
			jsonString=addStudyMetadataOperations(jsonString, project);
			JSONArray a = ParsingUtilities
					.evaluateJsonStringToArray(jsonString);
			//addStudyMetadataOperations(project,a);
			// Constructing defualt rdf operations.
			int count = a.length();
			for (int i = 0; i < count; i++) {
				JSONObject obj = a.getJSONObject(i);
               System.out.println(obj.toString());
				reconstructOperation(project, obj);
			}
			

			if (project.processManager.hasPending()) {
				respond(response, "{ \"code\" : \"pending\" }");
			} else {
				respond(response, "{ \"code\" : \"ok\" }");
			}
		} catch (JSONException e) {
			respondException(response, e);
		}
	}

	private String addStudyMetadataOperations(String jsonString, Project project) throws JSONException{
		ProjectMetadata projectMetadata = ProjectManager.singleton.getProjectMetadata(project.id);
		String attributes = (String) projectMetadata.getCustomMetadata("metadataAttributes");
		String slctStudyType=(String) projectMetadata.getCustomMetadata("slctStudyType");
		JSONObject attributes_arr = ParsingUtilities
		.evaluateJsonStringToObject(attributes);
		jsonString=jsonString.replace("{STUDY_URI}", slctStudyType);
		jsonString=jsonString.replace("{STUDY_CURIE}", "granatum:"+slctStudyType.substring(slctStudyType.lastIndexOf("/")+1));
		jsonString=jsonString.replace("{AUTHOR}", attributes_arr.get("author").toString());
		jsonString=jsonString.replace("{STUDY_REF}", attributes_arr.get("study_reference").toString());
		jsonString=jsonString.replace("{MEASURES}", attributes_arr.get("measure").toString());
		jsonString=jsonString.replace("{ACCESS_RIGHTS}", attributes_arr.get("accessRights").toString());
		jsonString=jsonString.replace("{SAME_AS}", attributes_arr.get("sameAs").toString());
		return jsonString;
	}
	/*private void addStudyMetadataOperations(Project project, JSONArray a) throws JSONException {
		ProjectMetadata projectMetadata = ProjectManager.singleton.getProjectMetadata(project.id);
		String attributes = (String) projectMetadata.getCustomMetadata("metadataAttributes");
		String slctStudyType=(String) projectMetadata.getCustomMetadata("slctStudyType");
		JSONObject attributes_arr = ParsingUtilities
		.evaluateJsonStringToObject(attributes);
		   StringWriter stringWriter = new StringWriter();
           JSONWriter jsonWriter = new JSONWriter(stringWriter);
           jsonWriter.object();
           jsonWriter.key("nodeType"); jsonWriter.value("resource");
           //FIXME : check with lena the study URI
           jsonWriter.key("value"); jsonWriter.value("http://chem.deri.ie/granatum/study_75307c70b94a4b0dcb30cb28b7220ac3");
           jsonWriter.key("rdfTypes"); 
           		jsonWriter.array();
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("http://granatum.org/schema/Study");
	           		jsonWriter.key("curie"); jsonWriter.value("granatum:Study");
	           		jsonWriter.endObject();
	           		
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value(slctStudyType);
	           		jsonWriter.key("curie"); jsonWriter.value("granatum:"+slctStudyType.substring(slctStudyType.lastIndexOf("/")+1));
	           		jsonWriter.endObject();
	           		
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("http://www.s3db.org/core#item");
	           		jsonWriter.key("curie"); jsonWriter.value("s3db:item");
	           		jsonWriter.endObject();
           		jsonWriter.endArray();
           	
           jsonWriter.key("links"); 
           		jsonWriter.array();
           		    // study reference 
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("study_reference");
	           		jsonWriter.key("curie"); jsonWriter.value("granatum:study_reference");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("resource");
	           			jsonWriter.key("value"); jsonWriter.value(attributes_arr.get("study_reference"));
	           			jsonWriter.key("rdfTypes"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.key("links"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           		
	           		// author
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("author");
	           		jsonWriter.key("curie"); jsonWriter.value("granatum:author");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("literal");
	           			jsonWriter.key("value"); jsonWriter.value(attributes_arr.get("author"));
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           		// hasPart
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("http://purl.org/dc/terms/hasPart");
	           		jsonWriter.key("curie"); jsonWriter.value("dc:hasPart");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("cell-as-resource");
	           			jsonWriter.key("expression"); jsonWriter.value("\"http://chem.deri.ie/granatum/bioassay_\"+value");
	           			jsonWriter.key("isRowNumberCell"); jsonWriter.value(false);
	           			jsonWriter.key("columnName"); jsonWriter.value("bioassay_uuid");
	           			jsonWriter.key("rdfTypes");jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.key("links");jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           		//measures
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("measures");
	           		jsonWriter.key("curie"); jsonWriter.value("granatum:measures");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("resource");
	           			jsonWriter.key("value"); jsonWriter.value(attributes_arr.get("measure"));
	           			jsonWriter.key("rdfTypes"); 
	           				jsonWriter.array();
	           				jsonWriter.object();
	    	           		jsonWriter.key("uri"); jsonWriter.value("http://granatum.org/schema/goURI");
	    	           		jsonWriter.key("curie"); jsonWriter.value("granatum:goURI");
	    	           		jsonWriter.endObject();
	           				jsonWriter.endArray();
	           			jsonWriter.key("links"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           	//	accessRights
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("http://purl.org/dc/terms/accessRights");
	           		jsonWriter.key("curie"); jsonWriter.value("dc:accessRights");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("resource");
	           			jsonWriter.key("value"); jsonWriter.value(attributes_arr.get("accessRights"));
	           			jsonWriter.key("rdfTypes"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.key("links"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           		
	           	// same As	
	           		jsonWriter.object();
	           		jsonWriter.key("uri"); jsonWriter.value("http://www.w3.org/2002/07/owl#sameAs");
	           		jsonWriter.key("curie"); jsonWriter.value("owl:sameAs");
	           		jsonWriter.key("target");
	           			jsonWriter.object();
	           			jsonWriter.key("nodeType"); jsonWriter.value("resource");
	           			jsonWriter.key("value"); jsonWriter.value(attributes_arr.get("sameAs"));
	           			jsonWriter.key("rdfTypes"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.key("links"); jsonWriter.array(); jsonWriter.endArray();
	           			jsonWriter.endObject();
	           		jsonWriter.endObject();
	           		
           		jsonWriter.endArray();	
           jsonWriter.endObject();
           
       a.getJSONObject(0).getJSONObject("schema").getJSONArray("rootNodes").put(jsonWriter.toString());    
		
	}*/

	protected  String getGranatumOperationFile() {
		
		// create file object
		BufferedInputStream bin = null;
		StringBuffer buffer=new StringBuffer();
		try {
			// create FileInputStream object
			InputStream fin = this.getClass().getResourceAsStream("/files/rdf.operations");

			// create object of BufferedInputStream
			bin = new BufferedInputStream(fin);

			// create a byte array
			byte[] contents = new byte[1024];

			int bytesRead = 0;
			String strFileContents;
			

			while ((bytesRead = bin.read(contents)) != -1) {

				strFileContents = new String(contents, 0, bytesRead);
				//System.out.print(strFileContents);
				buffer.append(strFileContents);
				
			}

		} catch (FileNotFoundException e) {
			System.out.println("File not found" + e);
		} catch (IOException ioe) {
			System.out.println("Exception while reading the file " + ioe);
		} finally {
			// close the BufferedInputStream using close method
			try {
				if (bin != null)
					bin.close();
			} catch (IOException ioe) {
				System.out.println("Error while closing the stream :" + ioe);
			}

		}
		
		
		return buffer.toString();
	}

	protected void reconstructOperation(Project project, JSONObject obj) {
		AbstractOperation operation = OperationRegistry.reconstruct(project,
				obj);
		if (operation != null) {
			try {
				Process process = operation.createProcess(project,
						new Properties());

				project.processManager.queueProcess(process);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
