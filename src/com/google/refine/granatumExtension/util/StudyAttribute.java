package com.google.refine.granatumExtension.util;

public class StudyAttribute {

	public String attributeName;
	public String AttributeRange;
	public String inputType="text";
	public String getInputType() {
		return inputType;
	}
	
	public String getAttributeName() {
		return attributeName;
	}
	public void setAttributeName(String attributeName) {
		this.attributeName = attributeName;
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
