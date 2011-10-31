
function GranatumOperationsDialog() {

	this._nodeUIs = [];
	this._createDialog();

};

GranatumOperationsDialog.prototype._createDialog = function() {
	var self = this;
	var frame = DialogSystem.createDialog();

	frame.width("1000px");

	var header = $('<div></div>').addClass("dialog-header").text(
			"Granatum Operations").appendTo(frame);
	var body = $('<div></div>').addClass("dialog-body").appendTo(frame);
	var footer = $('<div></div>').addClass("dialog-footer").appendTo(frame);
	this._constructFooter(footer);
	this._constructBody(body);
	this._level = DialogSystem.showDialog(frame);

};

GranatumOperationsDialog.prototype._constructFooter = function(footer) {
	var self = this;

	$('<button></button>').addClass('button')
			.html("&nbsp;&nbsp;OK&nbsp;&nbsp;").click(function() {

				$("input:checked").each(function() {
					var selected = $(this);
					alert(selected.val());
					self._runOperation(selected.val());

				});
				DialogSystem.dismissUntil(self._level - 1);
				/**/

			}).appendTo(footer);

	$('<button></button>').addClass('button').text("Cancel").click(function() {
		DialogSystem.dismissUntil(self._level - 1);
	}).appendTo(footer);

};
GranatumOperationsDialog.prototype._constructBody = function(body) {

	var self = this;
	body
			.html(DOM.loadHTML("granatum",
					"scripts/granatum-operations-form.html"));
	this._elmts = DOM.bind(body);
};

GranatumOperationsDialog.prototype._runOperation = function(oprID) {
	switch (oprID) {
	case "uuid":
		Refine.postCoreProcess("text-transform", {
				columnName : "uuid",
				expression : "grel:value.parseJson()",
				repeat : false,
				repeatCount : 10,
				onError : "set-to-blank"
			}, {}, { everythingChanged: true}, {});


		break;
	
	case "CSID":
		//Create column CSID at index 1 by fetching URLs based on column Compound using expression grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=SimpleSearch&label=\"+escape(value, \"url\")+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
		Refine.postCoreProcess("add-column-by-fetching-urls", {
			baseColumnName : "Compound",
			urlExpression : "grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=SimpleSearch&label=\"+escape(value, \"url\")+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"",
			newColumnName : "CSID",
			columnInsertIndex : 1,
			delay : "50000",
			onError : "set-to-blank"
		}, {}, { everythingChanged: true}, {

			onDone : function() {
			//Text transform on cells in column CSID using expression grel:value.parseJson()[1][\"0\"]
			Refine.postCoreProcess("text-transform", {
				columnName : "CSID",
				expression : "grel:value.parseJson()[1][\"0\"]",
				repeat : false,
				repeatCount : 10,
				onError : "set-to-blank"
			}, {}, {everythingChanged: true}, {});
				
			}
		}

		);
		break;
	case "chemSpiderURL":
		//Create column chemSpiderURL at index 2 based on column CSID using expression grel:if(value!='', 'http://www.chemspider.com/Chemical-Structure.'+value+'.html', '')
		Refine.postCoreProcess("add-column", {
			baseColumnName : "CSID",
			expression : "grel:if(value!='', 'http://www.chemspider.com/Chemical-Structure.'+value+'.html', '')",
			newColumnName : "chemSpiderURL",
			columnInsertIndex : 2,
			onError : "set-to-blank"
		}, {}, {everythingChanged: true}, {});
		break;
	case "chemSpiderURI":
		//Create column chemSpiderURI at index 2 based on column CSID using expression grel:\"http://www.chemspider.com/Chemical-Structure.\"+value+\".rdf\"
		Refine.postCoreProcess("add-column", {
			baseColumnName : "CSID",
			expression : "grel:\"http://www.chemspider.com/Chemical-Structure.\"+value+\".rdf\"",
			newColumnName : "chemSpiderURI",
			columnInsertIndex : 2,
			onError : "set-to-blank"
		}, {}, { everythingChanged: true}, {});
		break;
	case "getCompoundInfo":
		//Create column getCompoundInfo at index 2 by fetching URLs based on column CSID using expression grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=GetCompoundInfo&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
		Refine.postCoreProcess("add-column-by-fetching-urls", {
			baseColumnName : "CSID",
			urlExpression : "grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=GetCompoundInfo&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"",
			newColumnName : "getCompoundInfo",
			columnInsertIndex : 2,
			delay : "50000",
			onError : "set-to-blank"
		}, {}, { everythingChanged: true}, {});
		break;
	case "SMILES":
		
		Refine.postCoreProcess("add-column", {
			baseColumnName : "getCompoundInfo",
			expression : "grel:value.parseJson()[1][\"SMILES\"][\"0\"]",
			newColumnName : "SMILES",
			columnInsertIndex : 2,
			delay : "50000",
			onError : "set-to-blank"
		}, {}, { everythingChanged: true}, {});
	break;
	case "CSID2ExtRef":
		//Create column CSID2ExtRef at index 2 by fetching URLs based on column CSID using expression grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=CSID2ExtRefs&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"
		Refine.postCoreProcess("add-column-by-fetching-urls", {
			baseColumnName : "CSID2ExtRef",
			urlExpression : "grel:\"http://hcls.deri.org/c2sma/chemSpiderProxy.php?service=CSID2ExtRefs&csid=\"+value+\"&token=2913cb9b-a281-4752-b582-5fe15a663884\"",
			newColumnName : "CSID",
			columnInsertIndex : 1,
			delay : "50000",
			onError : "set-to-blank"
		}, {}, { everythingChanged: true}, {
			onDone : function() {
			//Create column chebiURI at index 3 based on column CSID2ExtRef using expression grel:value.parseJson()[1][\"chebiURI\"][0]
			Refine.postCoreProcess("add-column", {
				baseColumnName : "CSID2ExtRef",
				expression : "grel:value.parseJson()[1][\"chebiURI\"][0]",
				newColumnName : "chebiURI",
				columnInsertIndex : 3,
				delay : "50000",
				onError : "set-to-blank"
			}, {}, { everythingChanged: true}, {});
			Refine.postCoreProcess("add-column", {
				baseColumnName : "CSID2ExtRef",
				expression : "grel:value.parseJson()[1][\"chebiURI\"][1]",
				newColumnName : "chebiURI1",
				columnInsertIndex : 3,
				delay : "50000",
				onError : "set-to-blank"
			}, {}, {everythingChanged: true}, {
				
				onDone:function(){
				//Create column derefChebiURI at index 4 by fetching URLs based on column chebiURI1 using expression grel:\"http://chem.deri.ie/c2sma/rdf2json.php?&uri=\"+escape(value, \"url\")
				Refine.postCoreProcess("add-column-by-fetching-urls", {
					baseColumnName : "chebiURI1",
					urlExpression : "grel:\"http://chem.deri.ie/c2sma/rdf2json.php?&uri=\"+escape(value, \"url\")",
					newColumnName : "derefChebiURI",
					columnInsertIndex : 4,
					delay : "50000",
					onError : "set-to-blank"
				}, {}, {everythingChanged: true}, {
					
					onDone:function(){
					//Create column molecularMass at index 5 based on column derefChebiURI using expression grel:value.parseJson()[\"bio2rdf_resource:mass\"][0]"
					Refine.postCoreProcess("add-column-by-fetching-urls", {
						baseColumnName : "derefChebiURI",
						urlExpression : "grel:value.parseJson()[\"bio2rdf_resource:mass\"][0]",
						newColumnName : "molecularMass",
						columnInsertIndex : 5,
						delay : "50000",
						onError : "set-to-blank"
					}, {}, { everythingChanged: true}, {});
				}
				});
			}
			});
		}
		});
		break;
		

	}



};
/*
 */