//---------------------
$.post("/command/granatum/granatum-get-metadata?" + $.param( {
	"project" : theProject.id,
	"keys" : "slctStudyType,metadataAttributes,source,initial"
}), {

}, function(data) {
	controller = new GranatumSetupController();

	controller.setupOperations(data.customMetadata);

},"json");
//---------------------

GranatumSetupController = function() {

};

GranatumSetupController.prototype.setupOperations = function(data) {

	var timerId = setInterval(function() {

		if (theProject.columnModel) {
			clearInterval(timerId);
			// check the compound column
			var compoundExists = false;
			var project_columns = theProject.columnModel.columns;
			for ( var i = 0; i < project_columns.length; i++) {
				if (project_columns[i].name = "Compound") {
					compoundExists = true;
					break;
				}

			}

			if (compoundExists) {
				if (data.initial == "yes") {
					// ---------------------
					$.post("/command/granatum/granatum-save-metadata?"
							+ $.param( {
								"project" : theProject.id,
								"subCommand" : "save-metadata",
								"slctStudyType" : data.slctStudyType,
								"metadataAttributes" : data.metadataAttributes,
								"source" : "granatum",
								"initial" : "no"
							}), {
								
							}, function(o) {
							});
					// ---------------------

				
					 Refine.postProcess("granatum", "granatum-apply-column-operations",
							{
								"project" : theProject.id
							}, {}, {
								everythingChanged : true
							}, {
								onDone : function(o) {
									if (o.code == "pending") {
										// Something might have already been
										// done and so it's good to update
							Refine.update( {						everythingChanged : true							});
						}
					}
				}	);
					
				
					// ---------------------
					// Apply RDF operations	

						
					 Refine.postProcess("granatum", "granatum-apply-rdf-operations",
							{
								"project" : theProject.id
							}, {}, {
								everythingChanged : true
							}, {
								onDone : function(o) {
									if (o.code == "pending") {
										// Something might have already been
										// done and so it's good to update
										/*Refine.update( {
											everythingChanged : true
										});*/
						}
					}
				}	);
					
				
					// --------------------- 
					
				} else {
					//alert("Second time");
				}

			}

		}
	}, 1000);

};
