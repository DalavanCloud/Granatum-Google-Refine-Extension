/*

Copyright 2011, Google Inc.
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

Refine.GranatumDefaultImportingController = function(createProjectUI) {
	this._createProjectUI = createProjectUI;

	this._parsingPanel = createProjectUI.addCustomPanel();
	createProjectUI.addSourceSelectionUI( {
		label : "Granatum",
		id : "granatum",
		ui : new Refine.GranatumImportingSourceUI(this)
	});

};

Refine.CreateProjectUI.controllers
		.push(Refine.GranatumDefaultImportingController);

Refine.GranatumDefaultImportingController.prototype._startOver= Refine.DefaultImportingController.prototype._startOver;

Refine.GranatumDefaultImportingController.prototype.startImportJob = function(form, progressMessage, callback) {
	  var self = this;
	  var attrJSON = {"attributes": {}};
	   for(var i=0; i< $('.attributes').length;i++){
	    attrJSON.attributes[$('.attributes')[i].name]=$('.attributes')[i].value;
	    }
	 
	  $.post(
	      "/command/core/create-importing-job",
	      null,
	      function(data) {
	        var jobID = self._jobID = data.jobID;

	        form.attr("method", "post")
	        .attr("enctype", "multipart/form-data")
	        .attr("accept-charset", "UTF-8")
	        .attr("target", "create-project-iframe")
	        .attr("action", "/command/core/importing-controller?" + $.param({
	          "controller": "granatum/granatum-importing-controller",
	          "jobID": jobID,
	          "subCommand": "load-raw-data",
	          "slctStudyTypes" : $('#slctStudyTypes').val(),
	          "metadataAttributes" :JSON.stringify(attrJSON)
	        }));
	        form[0].submit();

	        var start = new Date();
	        var timerID = window.setInterval(
	          function() {
	            self._createProjectUI.pollImportJob(
	              start, jobID, timerID,
	              function(job) {
	                return job.config.hasData;
	              },
	              function(jobID, job) {
	                self._job = job;
	                self._onImportJobReady();
	                if (callback) {
	                  callback(jobID, job);
	                }
	              },
	              function(job) {
	                alert(job.config.error + '\n' + job.config.errorDetails);
	                self._startOver();
	              }
	            );
	          },
	          1000
	        );
	        self._createProjectUI.showImportProgressPanel(progressMessage, function() {
	          // stop the iframe
	          $('#create-project-iframe')[0].contentWindow.stop();

	          // stop the timed polling
	          window.clearInterval(timerID);

	          // explicitly cancel the import job
	          Refine.CreateProjectUI.cancelImportinJob(jobID);

	          self._createProjectUI.showSourceSelectionPanel();
	        });
	      },
	      "json"
	  );
	};

Refine.GranatumDefaultImportingController.prototype._onImportJobReady = Refine.DefaultImportingController.prototype._onImportJobReady;

Refine.GranatumDefaultImportingController.prototype._prepareData = Refine.DefaultImportingController.prototype._prepareData;

Refine.GranatumDefaultImportingController.prototype._showParsingPanel = Refine.DefaultImportingController.prototype._showParsingPanel;

Refine.GranatumDefaultImportingController.prototype._prepareParsingPanel = Refine.DefaultImportingController.prototype._prepareParsingPanel
Refine.GranatumDefaultImportingController.prototype._selectFormat = Refine.DefaultImportingController.prototype._selectFormat;

Refine.GranatumDefaultImportingController.prototype._createProject = function() {
	
	  if ((this._formatParserUI) && this._formatParserUI.confirmReadyToCreateProject()) {
		    var projectName = $.trim(this._parsingPanelElmts.projectNameInput[0].value);
		    if (projectName.length == 0) {
		      window.alert("Please name the project.");
		      this._parsingPanelElmts.projectNameInput.focus();
		      return;
		    }

		    var self = this;
		    var options = this._formatParserUI.getOptions();
		    options.projectName = projectName;
		    
		    var jobID=this._jobID;
		    $.post(
		      "/command/core/importing-controller?" + $.param({
		        "controller": "core/default-importing-controller",
		        "jobID": this._jobID,
		        "subCommand": "create-project"
		      }),
		      {
		        "format" : this._format,
		        "options" : JSON.stringify(options)
		      },
		      function(o) {
		        if (o.status == 'error') {
		          alert(o.message);
		          return;
		        }
		      
		        
		        var start = new Date();
		        var timerID = window.setInterval(
		          function() {
		            self._createProjectUI.pollImportJob(
		                start,
		                self._jobID,
		                timerID,
		                function(job) {
		                	
		                  return "projectID" in job.config;
		                },
		                function(jobID, job) {
		                  Refine.CreateProjectUI.cancelImportinJob(jobID);
		                 //---------------------
		                  $.ajax({
		                	  type: 'POST',
		                	  url: "/command/granatum/granatum-save-metadata?",
		                	  data: $.param({
		            		        "project": job.config.projectID,
		            		        "subCommand": "save-metadata",
		            		    	"slctStudyTypes" : job.config.slctStudyTypes,
		            		        "metadataAttributes" :JSON.stringify(job.config.metadataAttributes),
		            		        "source":"granatum",
		            		        "initial": "yes"
		            		      }),
		            		      async:false
		                	});
		                   //---------------------
		                  document.location = "project?project=" + job.config.projectID;
		                },
		                function(job) {
		                  alert('Errors:\n' + Refine.CreateProjectUI.composeErrorMessage(job));
		                  self._onImportJobReady();
		                }
		            );
		          },
		          1000
		        );
		        self._createProjectUI.showImportProgressPanel("Creating project ...", function() {
		          // stop the timed polling
		          window.clearInterval(timerID);

		          // explicitly cancel the import job
		          $.post("/command/core/cancel-importing-job?" + $.param({ "jobID": jobID }));

		          self._createProjectUI.showSourceSelectionPanel();
		       
		        });
		      },
		      "json"
		    );
		  }
		};

Refine.GranatumDefaultImportingController.prototype._ensureFormatParserUIHasInitializationData =Refine.DefaultImportingController.prototype._ensureFormatParserUIHasInitializationData; 
Refine.GranatumDefaultImportingController.prototype._disposeParserUI = Refine.DefaultImportingController.prototype._disposeParserUI;
Refine.GranatumDefaultImportingController.prototype.updateFormatAndOptions = Refine.DefaultImportingController.prototype.updateFormatAndOptions;
Refine.GranatumDefaultImportingController.prototype._startOver=Refine.DefaultImportingController.prototype._startOver;
Refine.GranatumDefaultImportingController.prototype.getPreviewData=Refine.DefaultImportingController.prototype.getPreviewData;
Refine.GranatumDefaultImportingController.prototype._disposeFileSelectionPanel=Refine.DefaultImportingController.prototype._disposeFileSelectionPanel;