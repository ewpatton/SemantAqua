package edu.rpi.tw.eScience.WaterQualityPortal.util;

@Deprecated
public class NameUtil {
	
	public static String processElementName(String elementName){
		System.out.println(elementName);
		String prd = elementName.replaceAll("\\.", "_");		
		//System.out.println(prd);
		prd = prd.replaceAll(",", "_");
		//System.out.println(prd);
		prd = prd.replaceAll(";", "_");
		//System.out.println(prd);
		prd = prd.replaceAll("'", "_");
		//System.out.println(prd);
		prd = prd.replaceAll("&gt", "_");
		//System.out.println(prd)
		prd = prd.replaceAll("&lt", "_");
		//System.out.println(prd)	
		prd = prd.replaceAll("&", "_"); 
		//System.out.println(prd);
		prd = prd.replaceAll("\\(", "_");
		//System.out.println(prd);
		prd = prd.replaceAll("\\)", "_");
		//System.out.println(prd);
		prd = prd.replaceAll("\\/", "_");
		//System.out.println(prd)
		prd = prd.replaceAll("\\+", "_");
		//System.out.println(prd)
		prd = prd.replaceAll("\\%", "_");
		//System.out.println(prd)		
		//new
		prd = prd.replaceAll("\"", "_");
		//System.out.println(prd)		
		prd = prd.replaceAll("<", "_");
		//System.out.println(prd)
		prd = prd.replaceAll(">", "_");
		//System.out.println(prd)		

		
		prd = prd.replaceAll("\\s", "_");
		prd = prd.replaceAll("_+", "_");
		if(prd.startsWith("_"))
			prd=prd.substring(1, prd.length());		
		if(prd.endsWith("_"))
			prd=prd.substring(0, prd.length()-1);
		System.out.println(prd);
		return prd;
	}
	
	
	

}
