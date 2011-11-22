/*

Copyright 2010, Google Inc.
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

    * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
    * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,           
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY           
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

// This file is added to the /project page

var granatumExtension = {};




	Refine.GranatumImportingSourceUI.prototype.attachUI = function(bodyDiv) {
	  var self = this;
	  bodyDiv.html(DOM.loadHTML("granatum", "scripts/index/granatum-study-selection-form.html"));
	  this._elmts = DOM.bind(bodyDiv);
	  this._elmts.noofcolumn.hide();
	  this._elmts.noofcolumnlbl.hide();
	  this._getStudyTypes();
	  this._elmts.slctStudyTypes.change(function(){
		var typeSelectedURI=self._elmts.slctStudyTypes.find(":selected").val();
		$('.attributes').remove();
		$('.attributeslbls').remove();
		self._generateStudyMetadataForm(typeSelectedURI);
	  });
	  this._elmts.slctEntry.change(function(){
		  var entrySelected=self._elmts.slctEntry.find(":selected").val();
		  if(entrySelected=="manual"){
			  self._elmts.noofcolumnlbl.show();
			  self._elmts.noofcolumn.show();
			  
		  }
		  else{
			  self._elmts.noofcolumnlbl.hide();
			  self._elmts.noofcolumn.hide();
		  }
		 
	  });
	  this._elmts.startbtn.click(function (){
		  var entrySelected=self._elmts.slctEntry.find(":selected").val();
		  if(entrySelected=="manual"){ 
			  //Manual Entry
				  self._handler._initManualEntryFunctions(self._elmts);
		  }
		  else{
			  // CSV file
			  self._handler._initFileEntryFunctions(self._elmts);
		  }
		 
	  });
	  
	};
	Refine.GranatumImportingSourceUI.prototype.focus = function() {
		  
	};
    
	
	Refine.GranatumImportingSourceUI.prototype._generateStudyMetadataForm=function(typeSelectedURI){
		  var self = this;
			var cmdUrl = "/command/granatum/granatum-get-study-attributes?" ;
			var param="uri="+typeSelectedURI;
			$.post(
					cmdUrl+param, 
					{},
					function(data) {
						
						if (data.code != "error") {	
						self._renderStudyAttributes(data);
						}
					},	
					"json"
			);
		
	};	
	Refine.GranatumImportingSourceUI.prototype._getStudyTypes=function(){
		  var self = this;
		var cmdUrl = "/command/granatum/granatum-get-study-types" ;
		$.post(
				cmdUrl, 
				{},
				function(data) {
					if (data.code != "error") {
					 self._renderStudyTypes(data);
					}
				},	
				"json"
		);
	};
	
	Refine.GranatumImportingSourceUI.prototype._renderStudyTypes= function(data){
		var selectElmt = this._elmts.slctStudyTypes[0];
		var option =$("<option value=\"\">Select Study Type ..</option>").appendTo(selectElmt);
		for(var i=0; i<data.studytypes.length;i++){
		
			var option =$("<option value="+data.studytypes[i].uri+">"+data.studytypes[i].name+"</option>").appendTo(selectElmt);
			
		}
	
		
		
	};
	Refine.GranatumImportingSourceUI.prototype._renderStudyAttributes= function(data){
		var table = this._elmts.attributesContainer[0];
	    for(var i=0;i<data.attributes.length;i++){
	    	var tr = table.insertRow(0);
			$(tr.insertCell(0)).html("<span class='attributeslbls'>"+data.attributes[i].name+"</span>");
			var inputhtml=$('<input type="text" name='+data.attributes[i].name+' />').addClass("attributes").appendTo(tr.insertCell(1));
			
	    }
		
	};
	