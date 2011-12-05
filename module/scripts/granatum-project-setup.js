//---------------------
$.post("/command/granatum/granatum-get-metadata?" + $.param( {
	"project" : theProject.id,
	"keys" : "slctStudyTypes,metadataAttributes,source,initial"
}), {

}, function(data) {
	controller = new GranatumSetupController();

	controller.setupOperations(data.customMetadata);

});
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

				
					 Refine.postProcess("granatum", "granatum-apply-operations",
							{
								"project" : theProject.id
							}, {}, {
								everythingChanged : true
							}, {
								onDone : function(o) {
									if (o.code == "pending") {
										// Something might have already been
										// done and so it's good to update
							Refine.update( {
								everythingChanged : true
							});
						}
					}
				}	);
					
				
					// ---------------------
					// ---------------------
					$.post("/command/granatum/granatum-save-metadata?"
							+ $.param( {
								"project" : theProject.id,
								"subCommand" : "save-metadata",
								"slctStudyTypes" : data.slctStudyTypes,
								"metadataAttributes" : JSON
								.stringify(data.metadataAttributes),
								"source" : "granatum",
								"initial" : "no"
							}), {
								
							}, function(o) {
							});
					// ---------------------

				} else {
					//alert("Second time");
				}

			}

		}
	}, 1000);

};
