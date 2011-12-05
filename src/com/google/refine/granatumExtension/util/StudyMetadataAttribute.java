package com.google.refine.granatumExtension.util;

public class StudyMetadataAttribute {

	public String attributeURI;
	public String getAttributeURI() {
		return attributeURI;
	}

	public void setAttributeURI(String attributeURI) {
		this.attributeURI = attributeURI;
	}
	public String AttributeRange;
	public String inputType="text";
	public String label;
	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getInputType() {
		return inputType;
	}
	

	public String getAttributeRange() {
		return AttributeRange;
	}
	public void setAttributeRange(String attributeRange) {
		AttributeRange = attributeRange;
	}
	public void setInputType(String type) {
		if(type.equals("http://www.w3.org/2002/07/owl#ObjectProperty")){ //is a uri
			this.inputType="dropdown";
		}
		else
		if(type.equals("http://www.w3.org/2002/07/owl#DatatypeProperty")){
			this.inputType = "text";
		}
		else
		{
			this.inputType = "text";
		}
	}
	
}
