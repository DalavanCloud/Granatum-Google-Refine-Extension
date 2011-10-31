package com.google.refine.granatumExtension.commands.column;

import javax.servlet.http.HttpServletRequest;

import org.json.JSONObject;

import com.google.refine.commands.EngineDependentCommand;
import com.google.refine.model.AbstractOperation;
import com.google.refine.model.Project;
import com.google.refine.operations.cell.TextTransformOperation;
import com.google.refine.operations.column.ColumnAdditionByFetchingURLsOperation;

public class AddColumnByFetchingURLsCommand extends EngineDependentCommand {
    @Override
    protected AbstractOperation createOperation(Project project,
            HttpServletRequest request, JSONObject engineConfig) throws Exception {
        
        String baseColumnName = "Compound";//request.getParameter("baseColumnName");
        String urlExpression = "grel:\"http://vmdhcls04.deri.ie/uuid.php\"";//request.getParameter("urlExpression");
        String newColumnName = "uuid";//request.getParameter("newColumnName");
        int columnInsertIndex = 1;//Integer.parseInt(request.getParameter("columnInsertIndex"));
        int delay = 5000;//Integer.parseInt(request.getParameter("delay"));
        String onError = "set-to-blank";//request.getParameter("onError");
        
        return new ColumnAdditionByFetchingURLsOperation(
            engineConfig, 
            baseColumnName, 
            urlExpression,
            TextTransformOperation.stringToOnError(onError),
            newColumnName,
            columnInsertIndex,
            delay
        );
    }

}