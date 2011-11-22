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
GranatumImportingHandler=function(controller){
	 this._controller=controller;
};

GranatumImportingHandler.prototype._initManualEntryFunctions = function(elmts) {
	
	var self = this;
	elmts.all.hide();
	var importingContainerDiv=$('<div></div>');
	importingContainerDiv.html(DOM.loadHTML("granatum", "scripts/index/granatum-insertion-form.html")); 
	importingContainerDiv.appendTo(elmts.importingContainerDiv);
	elmts.importingContainerDiv.show();
	var table =$('#expirmentTable')[0];
	var tr_coltitle=table.insertRow(0);
	$(tr_coltitle.insertCell(0)).html("<span class='coltitlelbls'>Compound</span>");
	$(tr_coltitle.insertCell(1)).html("<span class='coltitlelbls'>UUID</span>");
    var extraCols=elmts.noofcolumn.val();
    
    for(var j=1;j<=extraCols;j++){
    	$(tr_coltitle.insertCell(j+1)).html('<span class="coltitlelbls"><input type="text" name="extraCol" id="extraCol_'+j+'" /></span>');
    }
	
	
	var tr_record=table.insertRow(1);
	$(tr_record).addClass('clonedRecord');
	
	$(tr_record.insertCell(0)).html('<input type="text" name="compound_name" id="compound_name_1" class="bp_form_complete-all-name ac_input help_text_font" size="50"/>'+
			'<input type="hidden" id="bioportal_preferred_name_compound_name_1" name="compound_name_bioportal_preferred_name" />'+
			'<input type="hidden" id="bioportal_concept_id_compound_name_1" name="compound_name_bioportal_concept_id">'+
			'<input type="hidden" id="bioportal_ontology_id_compound_name_1" name="compound_name_bioportal_ontology_id" >'+
			'<input type="hidden" id="bioportal_full_id_compound_name_1" name="compound_name_bioportal_full_id">');
	$(tr_record.insertCell(1)).html('<input type="text" disabled="disabled"  name="compound_uuid" id="compound_uuid_1" />');
	for(var j=1;j<=extraCols;j++){
    	$(tr_record.insertCell(j+1)).html('<span class="coltitlelbls"><input type="text"  name="extraColVal_'+j+'" id="extraColVal_'+j+'_1"></span>');
    }
	
	var tr_addbtn=table.insertRow(2);
	$(tr_addbtn.insertCell(0)).html('<div><input type="button" id="btnAdd" bind="btnAdd" value="add" /></div>');
	
	var tr_clipboardbtn=table.insertRow(3);
	$(tr_clipboardbtn.insertCell(0)).html('<input type="hidden" bind="textInput" id="textInput" name="clipboard"/>'+
			' <input type="hidden" name="format" value="text/line-based/*sv">');
	
	var tr_btns=table.insertRow(4);
	$(tr_btns.insertCell(0)).html('<button id="nextButton" class="button button-primary" type="button">Next &raquo;</button>');
	$(tr_btns.insertCell(0)).html('<button id="backButton" class="button button-primary" type="button"> &laquo; Back </button>');
	
	
	formComplete_setup_functions();
	$('#backButton').click(function(evt) {
		elmts.all.show();
		elmts.importingContainerDiv.empty();
		elmts.importingContainerDiv.hide();
	});
	
	
	 $('#btnAdd').click(function(evt) {
		self._guidGenerator();
	    var num     = $('.clonedRecord').length; // how many "duplicatable" input fields we currently have
        var newNum  = new Number(num + 1);      // the numeric ID of the new input field being added
      
        var tr_record=table.insertRow(newNum);
     	$(tr_record).addClass('clonedRecord');
     	
     	$(tr_record.insertCell(0)).html('<input type="text" name="compound_name" id="compound_name_'+newNum+'" class="bp_form_complete-all-name ac_input help_text_font" size="50"/>'+
     			'<input type="hidden" id="bioportal_preferred_name_compound_name_'+newNum+'" name="compound_name_bioportal_preferred_name" />'+
     			'<input type="hidden" id="bioportal_concept_id_compound_name_'+newNum+'" name="compound_name_bioportal_concept_id">'+
     			'<input type="hidden" id="bioportal_ontology_id_compound_name_'+newNum+'" name="compound_name_bioportal_ontology_id" >'+
     			'<input type="hidden" id="bioportal_full_id_compound_name_'+newNum+'" name="compound_name_bioportal_full_id">');
     	$(tr_record.insertCell(1)).html('<input type="text" disabled="disabled"  name="compound_uuid" id="compound_uuid_'+newNum+'" />');
     	for(var j=1;j<=extraCols;j++){
         	$(tr_record.insertCell(j+1)).html('<span class="coltitlelbls"><input type="text" name="extraColVal_'+j+'"  id="extraColVal_'+j+'_'+newNum+'"></span>');
         }
         formComplete_setup_functions();
	  });
	
	 
	$('#nextButton').click(function(evt) {
          self._guidGenerator();
    	  var columnstitles="Compound;uuid;compound_name_bioportal_preferred_name;compound_name_bioportal_concept_id;compound_name_bioportal_ontology_id;compound_name_bioportal_full_id;";
    	  for(var j=1;j<=extraCols;j++){
    		  columnstitles+=$('#extraCol_'+j).val();
    		  if(j<extraCols){
    			  columnstitles+=";";  
    		  }
    	  }
    	  columnstitles+="\n";
		  var num  = $('.clonedRecord').length;
		  var datastr="";
		  //combine records is one string
		  for (var i=1;i<=num;i++){
			 var compound_name =$('#compound_name_'+i).val();
			 var compound_uuid =$('#compound_uuid_'+i).val();
			 var compound_name_bioportal_preferred_name=$('#bioportal_preferred_name_compound_name_'+i).val();
			 var compound_name_bioportal_concept_id=$('#bioportal_concept_id_compound_name_'+i).val();
			 var compound_name_bioportal_ontology_id=$('#bioportal_ontology_id_compound_name_'+i).val();
			 var compound_name_bioportal_full_id=$('#bioportal_full_id_compound_name_'+i).val();
			 datastr+=compound_name+";"+compound_uuid+";"+compound_name_bioportal_preferred_name+";"+compound_name_bioportal_concept_id+";"+compound_name_bioportal_ontology_id+";"+compound_name_bioportal_full_id+";";
			 for(var j=1;j<=extraCols;j++){
				 datastr+=$('#extraColVal_'+j+'_'+i).val();
	    		  if(j<extraCols){
	    			  datastr+=";";  
	    		  }
	    	  }
			 datastr+="\n";
		  }
		  
		  $('#textInput').val(columnstitles+datastr);
		  self._controller.startImportJob(elmts.myForm, "Uploading pasted data ...");
	    
	  });
	
	
	};

GranatumImportingHandler.prototype._guidGenerator= function () {
		
	    var S4 = function() {
	       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	    };
	    var uuid= (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	    
	    var num     = $('.clonedRecord').length; // how many "duplicatable" input fields we currently have
        $('input[name="compound_uuid"]')[num-1].value=uuid;
	};
	
GranatumImportingHandler.prototype._initFileEntryFunctions = function(elmts) {
		var self = this;
		elmts.all.hide();
		var importingContainerDiv=$('<div></div>');
		importingContainerDiv.html(DOM.loadHTML("granatum", "scripts/index/granatum-file-upload.html")); 
		importingContainerDiv.appendTo(elmts.importingContainerDiv);
		elmts.importingContainerDiv.show();
		
		
		$('#nextButton').click(function(evt) {
			   if ($('#fileInput')[0].files.length === 0) {
			      window.alert("You must specify a data file to import.");
			    } else {
			      self._controller.startImportJob(elmts.myForm, "Uploading data ...");
			    }
		    
		  });
		
		$('#backButton').click(function(evt) {
			elmts.all.show();
			elmts.importingContainerDiv.empty();
			elmts.importingContainerDiv.hide();
		});
		
		};
	