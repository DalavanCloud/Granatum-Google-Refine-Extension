function col_title_autocomplete_setup_functions() {
  $("input[class='col_title_form_complete']").each(function(){
    var ontology_id="";
    var target_property="name";
    var BP_search_branch = "";
    var BP_include_definitions ="";
    var extra_params = { input: $(this), target_property: target_property, subtreerootconceptid: encodeURIComponent(BP_search_branch), includedefinitions: BP_include_definitions, id: BP_ONTOLOGIES };
    var result_width = 450;
    // Add extra space for definition
    if (BP_include_definitions) {
      result_width += 275;
    }
    // Add space for ontology name
    if (ontology_id === "") {
      result_width += 200;
    }
    $(this).autocomplete(BP_SEARCH_SERVER + "/search/json_search/"+ontology_id, {
        extraParams: extra_params,
        lineSeparator: "~!~",
        matchSubset: 0,
        mustMatch: false,
        sortRestuls: false,
        minChars: 3,
        maxItemsToShow: 20,
        width: result_width,
        //onItemSelect: bpFormSelect,
        footer: '<div style="color: grey; font-size: 8pt; font-family: Verdana; padding: .8em .5em .3em;">Results provided by <a style="color: grey;" href="' + BP_SEARCH_SERVER + '">' + BP_ORG_SITE + '</a></div>',
        formatItem: formComplete_formatItem
    });

  });
}









