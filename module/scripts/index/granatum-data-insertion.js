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



function GranatumImportingSourceUI(controller) {
	  this._controller = controller;
	  this._controller._format = "text/line-based/*sv";
	}
	Refine.DefaultImportingController.sources.push({
	  "label": "Granatum",
	  "id": "granatum",
	  "uiClass": GranatumImportingSourceUI
	});

	GranatumImportingSourceUI.prototype.attachUI = function(bodyDiv) {
	  var self = this;

	  bodyDiv.html(DOM.loadHTML("granatum", "scripts/index/granatum-insertion-form.html"));

	  this._elmts = DOM.bind(bodyDiv);
	  this._elmts.nextButton.click(function(evt) {
		  // collect the data from the inputs and format them in CSV format .
		  //headers
		  var datastr="Compound;NAD(P)H:quinone reductase (QR) induction CD [µM]a;NAD(P)H:quinone reductase (QR) induction IC50 [µM];Cyp1A  inhibition IC50 [µM]";
		  var num     = $('.clonedRecord').length;
		  //combine records is one string
		  for (var i=0;i<num;i++){
			 var compoundname =$('input[name="compoundname"]')[i].value;
			 var nadcd =$('input[name="nadcd"]')[i].value;
			 var nadic =$('input[name="nadic"]')[i].value;
			 var cyp1aic =$('input[name="cyp1aic"]')[i].value;
			 datastr+="\n"+compoundname+";"+nadcd+";"+nadic+";"+cyp1aic;
		  }
		
	      self._elmts.textInput[0].value= datastr;
	      self._controller.startImportJob(self._elmts.form, "Uploading pasted data ...");
	    
	  });
	  this._elmts.btnAdd.click(function(evt) {
		 
		   
	      var num     = $('.clonedRecord').length; // how many "duplicatable" input fields we currently have
          var newNum  = new Number(num + 1);      // the numeric ID of the new input field being added
          alert(num);
          var recordsDiv=$('#recordsDiv');
          // create the new element via clone(), and manipulate it's ID using newNum value
          var newClonedRecord = $('#clonedRecord'+num).clone().attr("id","clonedRecord"+newNum).addClass("clonedRecord");
          // manipulate the name/id values of the input inside the new element
          newClonedRecord.children().each(function(){
        	  var kid = $(this);
        	  kid.attr('id', kid.attr('id').replace(/\d+/g, '') + newNum);
        	  kid.val('');
          });
          newClonedRecord.appendTo(recordsDiv);
          
	  });
	};

	GranatumImportingSourceUI.prototype.focus = function() {
	  this._elmts.textInput.focus();
	};
