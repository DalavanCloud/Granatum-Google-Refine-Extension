package com.google.refine.granatumExtension.commands;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.Buffer;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.google.refine.commands.Command;
import com.google.refine.commands.history.ApplyOperationsCommand;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Project;
import com.google.refine.operations.OperationRegistry;
import com.google.refine.process.Process;
import com.google.refine.util.ParsingUtilities;

public class ApplyGranatumOperationsCommand extends ApplyOperationsCommand {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Project project = getProject(request);
		String jsonString = getGranatumOperationFile();
		
		try {
			JSONArray a = ParsingUtilities
					.evaluateJsonStringToArray(jsonString);
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

	protected  String getGranatumOperationFile() {
		
		// create file object
		BufferedInputStream bin = null;
		StringBuffer buffer=new StringBuffer();
		try {
			// create FileInputStream object
			InputStream fin = this.getClass().getResourceAsStream("/files/jsonop2");

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
