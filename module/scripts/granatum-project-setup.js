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

					/*// alert("First time");
					// Create column cma_uuid at index 1 by fetching URLs based
					// on
					// column Name of the Compound using expression
					// grel:http://vmdhcls04.deri.ie/uuid.php
					Refine
					.postCoreProcess(
							"add-column-by-fetching-urls",
							{
								baseColumnName : "Compound",
								urlExpression : 'grel:"http://vmdhcls04.deri.ie/uuid.php"',
								newColumnName : "cma_uuid",
								columnInsertIndex : 1,
								delay : "50000",
								onError : "set-to-blank"
							}, {}, {
								everythingChanged : true,
								includeEngine : false
							}, {});

					// Create column bioassay_uuid at index 1 by fetching URLs
					// based on
					// column Name of the Compound using expression
					// grel:http://vmdhcls04.deri.ie/uuid.php
					Refine
					.postCoreProcess(
							"add-column-by-fetching-urls",
							{
								baseColumnName : "Compound",
								urlExpression : 'grel:"http://vmdhcls04.deri.ie/uuid.php"',
								newColumnName : "bioassay_uuid",
								columnInsertIndex : 1,
								delay : "50000",
								onError : "set-to-blank"
							}, {}, {
								everythingChanged : true,
								includeEngine : false
							}, {});

					// Create column chemSpiderID2 at index 1 by fetching URLs
					// based on
					// column Name of the Compound using expression
					// grel:\"http://srvgal78.deri.ie/c2sma/chemSpiderProxy.php?service=SimpleSearch\"+escape(value,
					// 'url')+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
					Refine
					.postCoreProcess(
							"add-column-by-fetching-urls",
							{
								baseColumnName : "Compound",
								urlExpression : 'grel:"http://srvgal78.deri.ie/c2sma/chemSpiderProxy.php?service=SimpleSearch&label="+escape(value, "url")+"&token=2913cb9b-a281-4752-b582-5fe15a663884"',
								newColumnName : "chemSpiderID2",
								columnInsertIndex : 1,
								delay : "50000",
								onError : "set-to-blank"
							}, {}, {
								everythingChanged : true,
								includeEngine : false
							}, {

								onDone : function() {
								// Text transform on cells in column
								// chemSpiderID2 using expression
								// grel:if(value.parseJson()[0]==\"true\",
								// value.parseJson()[1][\"0\"], \"\")"
								Refine
								.postCoreProcess(
										"text-transform",
										{
											columnName : "chemSpiderID2",
											expression : 'grel:if(value.parseJson()[0]=="true", value.parseJson()[1]["0"], "")',
											repeat : false,
											repeatCount : 10,
											onError : "set-to-blank"
										},
										{},
										{
											everythingChanged : true,
											includeEngine : false
										}, {

											onDone : function() {
											// Create column
											// thumbnail at index 2
											// by fetching URLs
											// based on column
											// chemSpiderID2 using
											// expression
											// grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=GetCompoundThumbnail&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
											Refine
											.postCoreProcess(
													"add-column-by-fetching-urls",
													{
														baseColumnName : "chemSpiderID2",
														urlExpression : 'grel:"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=GetCompoundThumbnail&csid="+value+"&token=2913cb9b-a281-4752-b582-5fe15a663884"',
														newColumnName : "thumbnail",
														columnInsertIndex : 1,
														delay : "50000",
														onError : "set-to-blank"
													},
													{},
													{
														everythingChanged : true,
														includeEngine : false
													},
													{

														onDone : function() {

														Refine
														.postCoreProcess(
																"text-transform",
																{
																	columnName : "thumbnail",
																	expression : 'grel:if(value.parseJson()[0]=="true", value.parseJson()[1], "")',
																	repeat : false,
																	repeatCount : 10,
																	onError : "set-to-blank"
																},
																{},
																{
																	everythingChanged : true,
																	includeEngine : false
																},
																{});

													}
													});

											// Create column CSID2ExtRef
											// at index 2 by fetching
											// URLs based on column
											// chemSpiderID2 using
											// expression
											// grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=CSID2ExtRefs&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
											Refine
											.postCoreProcess(
													"add-column-by-fetching-urls",
													{
														baseColumnName : "chemSpiderID2",
														urlExpression : 'grel:"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=CSID2ExtRefs&csid="+value+"&token=2913cb9b-a281-4752-b582-5fe15a663884"',
														newColumnName : "CSID2ExtRef",
														columnInsertIndex : 1,
														delay : "50000",
														onError : "set-to-blank"
													},
													{},
													{
														everythingChanged : true,
														includeEngine : false
													}, {});

										
											// Create column getCompoundInfo at index 1 by fetching URLs
											// based on column Compound using expression
											// grel:\"http://srvgal78.deri.ie/c2sma/chemSpiderProxy.php?service=GetCompoundInfo&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
											Refine
											.postCoreProcess(
													"add-column-by-fetching-urls",
													{
														baseColumnName : "chemSpiderID2",
														urlExpression : 'grel:"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=GetCompoundInfo&csid="+value+"&token=2913cb9b-a281-4752-b582-5fe15a663884"',
														newColumnName : "getCompoundInfo",
														columnInsertIndex : 1,
														delay : "50000",
														onError : "set-to-blank"
													}, {}, {
														everythingChanged : true,
														includeEngine : false
													}, {

														onDone : function() {
														// Create column
														// SMILES_by_ChemSpider at index 2
														// based on column getCompoundInfo
														// using expression
														// grel:value.parseJson()[1][\"SMILES\"][\"0\"]
														Refine
														.postCoreProcess(
																"column-addition",
																{
																	baseColumnName : "getCompoundInfo",
																	newColumnName : "SMILES_by_ChemSpider",
																	expression : 'grel:value.parseJson()[1]["SMILES"]["0"]',
																	columnInsertIndex : 2,
																	onError : "set-to-blank"
																},
																{},
																{
																	everythingChanged : true,
																	includeEngine : false
																}, {});
														Refine
														.postCoreProcess(
																"column-addition",
																{
																	baseColumnName : "getCompoundInfo",
																	newColumnName : "inchi",
																	expression : 'grel:value.parseJson()[1]["InChI"]["0"]',
																	columnInsertIndex : 2,
																	onError : "set-to-blank"
																},
																{},
																{
																	everythingChanged : true,
																	includeEngine : false
																}, {});
														Refine
														.postCoreProcess(
																"column-addition",
																{
																	baseColumnName : "getCompoundInfo",
																	newColumnName : "inchikey",
																	expression : 'grel:value.parseJson()[1]["InChIKey"]["0"]',
																	columnInsertIndex : 2,
																	onError : "set-to-blank"
																},
																{},
																{
																	everythingChanged : true,
																	includeEngine : false
																}, {});

													}
													});

										
										}
										});

							}
							});
*/
					//Set up the RDF skeleton 
					
					 $.post("/command/granatum/granatum-apply-rdf-operations?" +
					 $.param( { "project" : theProject.id }), { }, function(o) {
					 });
				
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
					alert("Second time");
				}

			}

		}
	}, 1000);

};
