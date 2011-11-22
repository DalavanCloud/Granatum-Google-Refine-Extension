package com.google.refine.granatumExtension.commands;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.xerces.xni.grammars.Grammar;
import org.json.JSONWriter;

import com.google.refine.commands.Command;
import com.google.refine.granatumExtension.util.GranatumOntology;

public class GetStudyTypesCommand extends Command {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Type", "application/json");
        try{
          
          GranatumOntology granatumOntology=new GranatumOntology();
          ArrayList<String> studyTypes = granatumOntology.getStudyTypes();
          JSONWriter writer = new JSONWriter(response.getWriter());
            writer.object();
            writer.key("studytypes");
            writer.array();
            for (Iterator iterator = studyTypes.iterator(); iterator.hasNext();) {
				String studyType = (String) iterator.next();
				writer.object();
            	writer.key("name"); writer.value(studyType.substring(studyType.lastIndexOf("/")+1));
            	writer.key("uri"); writer.value(studyType);
            	writer.endObject();
            }
            writer.endArray();
            writer.endObject();
        } catch (Exception e) {
            respondException(response, e);
        }
	}

}
