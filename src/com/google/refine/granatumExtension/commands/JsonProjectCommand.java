package com.google.refine.granatumExtension.commands;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.refine.ProjectManager;
import com.google.refine.ProjectMetadata;
import com.google.refine.commands.Command;
import com.google.refine.commands.HttpUtilities;
import com.google.refine.importing.ImportingJob;
import com.google.refine.importing.ImportingManager;
import com.google.refine.importing.ImportingUtilities;
import com.google.refine.importing.ImportingManager.Format;
import com.google.refine.model.Project;
import com.google.refine.util.JSONUtilities;
import com.google.refine.util.ParsingUtilities;

public class JsonProjectCommand extends Command{
	final static Logger logger = LoggerFactory.getLogger("project-json_command");

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {


        ProjectManager.singleton.setBusy(true);
        try {
        	
        	long projectID = Project.generateID();
            logger.info("Importing existing project using new ID {}", projectID);
            
            //ProjectManager.singleton.loadProjectMetadata(projectID);

            //ProjectMetadata pm = ProjectManager.singleton.getProjectMetadata(projectID);
            //pm.setName("test"+projectID);
            
            Properties parameters = ParsingUtilities.parseUrlParameters(request);
            
            ImportingJob job = ImportingManager.createJob();
            JSONObject config = job.getOrCreateDefaultConfig();
            ImportingUtilities.loadDataAndPrepareJob(
                    request, response, parameters, job, config);
            
            logger.info("config......", config);
            
            String format = "text/json";
            
            JSONObject optionObj = null;
            String optionsString = request.getParameter("options");
            if (optionsString != null && !optionsString.isEmpty()) {
                optionObj = ParsingUtilities.evaluateJsonStringToObject(optionsString);
            } else {
                Format formatRecord = ImportingManager.formatToRecord.get(format);
                optionObj = formatRecord.parser.createParserUIInitializationData(
                    job, ImportingUtilities.getSelectedFileRecords(job), format);
            }
            adjustLegacyOptions(format, parameters, optionObj);
            
            //String projectName = parameters.getProperty("project-name");
            //if (projectName != null && !projectName.isEmpty()) {
               // JSONUtilities.safePut(optionObj, "projectName", projectName);
                JSONUtilities.safePut(optionObj, "projectName", "test"+projectID);
            //}
            
            List<Exception> exceptions = new LinkedList<Exception>();
            
            long projectId = ImportingUtilities.createProject(job, "text/json", optionObj, exceptions, true);

            HttpUtilities.redirect(response, "/project?project=" + projectId);
        } catch (Exception e) {
            respondWithErrorPage(request, response, "Failed to import file", e);
        } finally {
            ProjectManager.singleton.setBusy(false);
        }

    }

    static private void adjustLegacyOptions(String format, Properties parameters, JSONObject optionObj) {
        if (",".equals(parameters.getProperty("separator"))) {
            JSONUtilities.safePut(optionObj, "separator", ",");
        } else if ("\\t".equals(parameters.getProperty("separator"))) {
            JSONUtilities.safePut(optionObj, "separator", "\t");
        }
        
        adjustLegacyIntegerOption(format, parameters, optionObj, "ignore", "ignoreLines");
        adjustLegacyIntegerOption(format, parameters, optionObj, "header-lines", "headerLines");
        adjustLegacyIntegerOption(format, parameters, optionObj, "skip", "skipDataLines");
        adjustLegacyIntegerOption(format, parameters, optionObj, "limit", "limit");
        
        adjustLegacyBooleanOption(format, parameters, optionObj, "guess-value-type", "guessCellValueTypes", false);
        adjustLegacyBooleanOption(format, parameters, optionObj, "ignore-quotes", "processQuotes", true);
    }

    static private void adjustLegacyIntegerOption(
        String format, Properties parameters, JSONObject optionObj, String legacyName, String newName) {
        
        String s = parameters.getProperty(legacyName);
        if (s != null && !s.isEmpty()) {
            try {
                JSONUtilities.safePut(optionObj, newName, Integer.parseInt(s));
            } catch (NumberFormatException e) {
                // Ignore
            }
        }
    }
    
    static private void adjustLegacyBooleanOption(
        String format,
        Properties parameters,
        JSONObject optionObj,
        String legacyName,
        String newName,
        boolean invert) {
        
        String s = parameters.getProperty(legacyName);
        if (s != null && !s.isEmpty()) {
            JSONUtilities.safePut(optionObj, newName, Boolean.parseBoolean(s));
        }
    }
}
