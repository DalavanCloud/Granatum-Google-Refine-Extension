package com.google.refine.granatumExtension.commands;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONWriter;

import com.google.refine.commands.Command;
import com.google.refine.granatumExtension.util.GranatumOntology;
import com.google.refine.granatumExtension.util.StudyAttribute;

public class GetStudyAttributesCommand extends Command {

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String selectedStudy = request.getParameter("uri");
		response.setCharacterEncoding("UTF-8");
        response.setHeader("Content-Type", "application/json");
        try{
          
          GranatumOntology granatumOntology=new GranatumOntology();
          ArrayList<StudyAttribute> studyAttributes = granatumOntology.getStudyAttributes(selectedStudy);
          JSONWriter writer = new JSONWriter(response.getWriter());
            writer.object();
            writer.key("attributes");
            writer.array();
            for (Iterator iterator = studyAttributes.iterator(); iterator.hasNext();) {
            	StudyAttribute attr =(StudyAttribute) iterator.next();
				writer.object();
            	writer.key("name"); writer.value(attr.getAttributeName().substring(attr.getAttributeName().lastIndexOf("#")+1));
            	writer.key("range"); writer.value(attr.getAttributeRange());
            	writer.key("input"); writer.value(attr.getInputType());
            	writer.endObject();
            }
            writer.endArray();
            writer.endObject();
        } catch (Exception e) {
            respondException(response, e);
        }
		
	}

}
