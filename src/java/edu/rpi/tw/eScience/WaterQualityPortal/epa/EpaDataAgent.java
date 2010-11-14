package edu.rpi.tw.eScience.WaterQualityPortal.epa;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

public class EpaDataAgent {
	static int BUFFER_SIZE = 4096;
	static String searchByZipTarget = "http://www.epa-echo.gov/cgi-bin/ideaotis.cgi";
	static String searchByZipContent = "idea_active=Y&idea_database=PBL&media_tool=ECHOI&idea_client=otis_pba&idea_pcs_migrate=Y&func_nametype=CASE&func_nametype=FACILITY&idea_linkage=LINKED+NONLINKED&idea_db_filter=INC+AFS+ICI+FRS+PCS+ICP+RCR+TRI+DEM+NEI&idea_report=OTISECHO+PARM+SORTNAME_tricommas_pencommas_DEMRADIUS%3D3_violqtrsmax%3D12&otis_custom_col=7%2C21%2C12%2C24%2C13%2C19%2C18%2C23%2C15%2C29&idea_major=&idea_zip_any=";
	//12180&zip=12180
	static String zipPostFix="&zip=";
	static String upMostDir = "/home/ping/research/python/water/CgiSoupOutput/";
	static String scriptExtractSearchResult="/home/ping/research/python/water/epaCgi.py";
	static String soupDataFile="/epaCgiSoupData";
	static String geoTargetPre = "http://maps.googleapis.com/maps/api/geocode/xml?address=";
	static String geoTargetPost ="&sensor=false";
	static String getContent = "";
	static String geoDataFile="/facilityGeo";
	static String soupAddressFile="/epaCgiSoupAddress";
	static String facilityPagePre = "http://www.epa-echo.gov/cgi-bin/get1cReport.cgi?tool=echo&IDNumber=";
	static String facilityFolder = "/facPage/";
	static String facilityHtmlPre = "epaFacHtml";
	static String facilitySoupPre = "epaFacSoup";
	static String scriptExtractFac="/home/ping/research/python/water/epaFac.py";
	//OCV
	static String OCVFolder = "/OCVPage/";
	static String OCVHtmlPre = "epaOCVHtml";
	//Solids
	static String SolidsFolder = "/Solids/";
	static String SolidsHtmlPre = "epaSolidsHtml";	
	static int numQtr=12;
	
	HashMap<Integer, Facility> facilities = null;
	ArrayList<Facility> facilitiesWithViolations = null;	
	EpaCommAgent commAgent=null;
	
	public EpaDataAgent(){
		facilities = new HashMap<Integer, Facility>();
		facilitiesWithViolations = new ArrayList<Facility>();
		commAgent = new EpaCommAgent();
	}
	
	private void queryOCVPages(String zipCode){
		Facility curFacility=null;		
		Iterator itr = facilitiesWithViolations.iterator();  
		while (itr.hasNext()) {  
			curFacility = (Facility)itr.next();
			getOCVPage(zipCode, curFacility);          	
		}
	}
	
	private void queryFacilityPages(String zipCode){
		Facility curFacility=null;
		
		Iterator itrOut = facilities.entrySet().iterator();  
        while (itrOut.hasNext()) {  
        	Map.Entry entryOut = (Map.Entry)itrOut.next();
        	//Integer ID = (Integer)entryOut.getKey();
        	curFacility = (Facility)entryOut.getValue();
        	//only inspect the facilities that have inspections and non compliances
        	if(curFacility.numInspection>0 && (curFacility.numQtrNC>0 || curFacility.numEE>0))
        	{
        		procFacilityPage(zipCode, curFacility); 
        		facilitiesWithViolations.add(curFacility);
        	}
        		  	
        }
	}
	
	/*
	static String facilityPagePre = "http://www.epa-echo.gov/cgi-bin/get1cReport.cgi?tool=echo&IDNumber=";
	static String facilitySoupDir = upMostDir+"facPage/";
	static String facilityHtmlPre = "epaFacHtml";
	static String facilitySoupPre = "epaFacSoup";
		*/	
	private void procFacilityPage(String zipCode, Facility curFac){
		//mkDir
		String facilityDir = upMostDir+zipCode+facilityFolder;
		mkDir(facilityDir);
		//download html
		String IDNum = curFac.ID;
		String getTarget = facilityPagePre + IDNum;
		String facHtml = facilityDir + facilityHtmlPre + IDNum;
		commAgent.doCommunication(0, getTarget, getContent, facHtml);
		//invoke python script
		String curArgs[] = new String [2]; 
		curArgs[0] = facHtml;
		String facSoupPath = facilityDir + facilitySoupPre + IDNum;
		curArgs[1] = facSoupPath;
		pythonExe(scriptExtractFac, curArgs, 2);
		//
		getDataFromFacilitySoup(facSoupPath, curFac);
	}
	
	private void getOCVPage(String zipCode, Facility curFac){
		//mkDir
		String ocvDir = upMostDir+zipCode+OCVFolder;
		mkDir(ocvDir);
		//download html
		String IDNum = curFac.ID;
		String ocvHtml = ocvDir + OCVHtmlPre + IDNum;
		String getTarget = curFac.OCVLink;
		if(getTarget!=null)
			commAgent.doCommunication(0, curFac.OCVLink, getContent, ocvHtml);		
	}
	
	private void getDataFromFacilitySoup(String fileName, Facility curFac){
		//link of Only Charts with Violations
		String linkChartsWithViolations=null;
		ArrayList<String> qtrDurList=null;
		ArrayList<String> NCBoolList=null;
		
		String curLine;
		FileInputStream fIn = null;
		BufferedReader reader = null;
		int httpIndex = -1;

		
		try {
			fIn =  new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(fIn));
			
			curLine = reader.readLine();
			if(curLine.compareTo("No CWA")==0)
				return;
			
			if(curLine.indexOf("effluents.cgi")!=-1){
				httpIndex = curLine.indexOf("http:");
				linkChartsWithViolations = curLine.substring(httpIndex,
						curLine.indexOf('\'', httpIndex));
				curFac.setOCVLink(linkChartsWithViolations);
				//for test
				System.out.println("linkChartsWithViolations: "+linkChartsWithViolations);
			}
			else if(curLine.compareTo("No Only Charts with Violations")==0){
				linkChartsWithViolations = null;
			}
			else {
				System.err.println("In getDataFromFacilitySoup, err in reading link");
				System.exit(0);						
			}
			
			while ((curLine = reader.readLine()) != null) { 
				if(curLine.compareTo("qtr Duration List")==0){
					qtrDurList = new ArrayList<String>(numQtr);
					for(int i=0;i<numQtr;i++){
						curLine = reader.readLine();
						qtrDurList.add(i, curLine.substring(0, curLine.length()-1));
					}	
					curFac.setQtrDurList(qtrDurList);
				}//end of if
				if(curLine.compareTo("NC Boolean List")==0){
					NCBoolList = new ArrayList<String>(numQtr);
					for(int i=0;i<numQtr;i++){
						curLine = reader.readLine();
						NCBoolList.add(i, curLine.substring(1));
					}
					curFac.setNCBoolList(NCBoolList);
					//break from the while, since we don't need other data for now
					break;
				}//end of if				
			}//end of while
		} catch (Exception e) {
			System.err.println("In getDataFromFacilitySoup, err in reading file");
			e.printStackTrace();
		}	
		
	}
	
	private void getLocation(String fileName, String resultFile){
		String curLine;
		String getTarget = null;
		FileInputStream fIn = null;
		BufferedReader reader = null;
		BufferedWriter bufferedWriter = null;
		
		try {
			fIn =  new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(fIn));							
			bufferedWriter = new BufferedWriter(new FileWriter(resultFile));


			while ((curLine = reader.readLine()) != null) { 				
				//http://maps.googleapis.com/maps/api/geocode/xml?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&sensor=false
				String address = curLine.replace(' ', '+');
				getTarget = geoTargetPre+address+geoTargetPost;
				//Pause for 2 seconds
	            Thread.sleep(2000);
				commAgent.doCommunication(0, getTarget, getContent, bufferedWriter);
				bufferedWriter.write('\n');	
			}		
		}
		catch (Exception e) {
			System.err.println("In getLocation, err");
			e.printStackTrace();
		}finally {
			//Close the BufferedReader and BufferedWriter			
			try {
				if (reader!=null)
					reader.close ();
				if (bufferedWriter != null) {
					bufferedWriter.flush();
					bufferedWriter.close();
				}
			} catch (IOException ex) {
				System.out.println("In getLocation(), closing the reader and BufferedWriter");
				ex.printStackTrace();
			}
		}

	}
	
/*	private String convertAddress(String address){
		String result=null;
		result = address.replace(' ', '+');
		return result;		
	}
	*/
	
	void mkDir(String dirName){
		File dir = new File(dirName);
		boolean dirOK = false;
		if(!dir.exists()){
			dirOK = dir.mkdir();
			if(!dirOK){
				System.out.println("Cannot create the directory '" + dir);
				System.exit(0);
			}
		}		
	}
	
	private void getGeoFromXML(String fileName){
		String curLine;	
		FileInputStream fIn = null;
		BufferedReader reader = null;
		String curLat, curLng, curStatus;
		int latIndex=-1, lngIndex=-1, stsIndex=-1; 
		Integer mapIndex=-1;
		Facility curFacility=null;
		
		try {
			fIn =  new FileInputStream(fileName);
			reader = new BufferedReader(new InputStreamReader(fIn));

			while ((curLine = reader.readLine()) != null) { 
				//start of a new XML
				if(curLine.indexOf("?xml")!=-1) {
					mapIndex ++;
					curLine = reader.readLine();
					curLine = reader.readLine();
					stsIndex = curLine.indexOf("<status>");
					if(stsIndex == -1) {
						System.err.println("In getGeoFromXML, err in reading <status>");
						System.exit(0);	
					}
					else {
						curStatus = curLine.substring(stsIndex+8, curLine.indexOf("</status>"));
						if(curStatus.compareTo("OK") != 0){
							System.out.println("In getGeoFromXML, abnormal XML status: "+curStatus);
							continue;//go to the next XML
						}
					}
					
					while(true){
						curLine = reader.readLine();
						if(curLine == null)//end of file
							break;	
						
						//get the 1st pair of lat and lng 
						if((latIndex = curLine.indexOf("<lat>")) != -1) {
							curLat = curLine.substring(latIndex+5, curLine.indexOf("</lat>"));	
							curLine = reader.readLine();
							if((lngIndex = curLine.indexOf("<lng>")) == -1){
									System.err.println("In getGeoFromXML, err in reading LNG");
									System.exit(0);	
							}
							curLng = curLine.substring(lngIndex+5, curLine.indexOf("</lng>"));
							curFacility = facilities.get(mapIndex);
							if(curFacility == null){
								System.err.println("In getGeoFromXML, err in getting Facility with index: "+mapIndex);
								System.exit(0);	
							}
							curFacility.setLocation(curLat, curLng);
							break;//go to the next XML
						}//end of if find <lat>
					}//end of the inner while				
				}//end of if find ?xml
			}//end of the out while		
		}
		catch (Exception e) {
			System.err.println("In getGeoFromXML, err");
			e.printStackTrace();
		}finally {
			//Close the BufferedReader and BufferedWriter			
			try {
				if (reader!=null)
					reader.close ();
			} catch (IOException ex) {
				System.out.println("In getLocation(), closing the reader and BufferedWriter");
				ex.printStackTrace();
			}
		}
		
	}
	private void getFacilityFromFile(String fileName){
		String curLine;
		String curID;
		String curName;
		String curAddressLine1;
		String curAddressLine2;
		int curNumInspection=0;
		int curNumQtrNC=0;
		int curNumEE=0;
		int insIndex=0;//for curNumInspection
		int qtrIndex=0;//for curNumQtrNC
		int eeIndex=0;//for curNumEE
		String strNumInspection;
		String strNumQtrNC;
		String strNumEE;
		Integer IDForMap=0;
		
		try {
			FileInputStream fIn =  new FileInputStream(fileName);
			BufferedReader reader = new BufferedReader(new InputStreamReader(fIn));
			
			curLine = reader.readLine();
			while (curLine != null) { 
				//ID
				if(curLine.indexOf("FRS ID")==-1) {
					System.err.println("In readDataFromFile, err in reading RFS ID");
					System.exit(0);						
				}
				curID = curLine.substring(curLine.indexOf(':')+2, curLine.length()-1);
				//Name
				curLine = reader.readLine();
				if(curLine == null || curLine.indexOf("Name:")==-1) {
					System.err.println("In readDataFromFile, err in reading Name");
					System.exit(0);						
				}
				curName = curLine.substring(curLine.indexOf(':')+2, curLine.length()-1);
				//Address line 1
				curLine = reader.readLine();
				if(curLine == null || curLine.indexOf("AL1:")==-1) {
					System.err.println("In readDataFromFile, err in reading AddressLine1");
					System.exit(0);						
				}
				curAddressLine1 = curLine.substring(curLine.indexOf(':')+2, curLine.length()-1);
				//Address line 2
				curLine = reader.readLine();
				if(curLine == null || curLine.indexOf("AL2:")==-1) {
					System.err.println("In readDataFromFile, err in reading AddressLine1");
					System.exit(0);						
				}
				curAddressLine2 = curLine.substring(curLine.indexOf(':')+2, curLine.length()-1);
				curNumInspection=0;
				curNumQtrNC=0;
				curNumEE=0;
				//NumInspection, NumQtrNC, curNumEE
				while(true){
					curLine = reader.readLine();
					if(curLine == null)//end of file
						break;			
					if(curLine.indexOf("FRS ID") != -1) 
						break;
					insIndex = curLine.indexOf("I");
					qtrIndex = curLine.indexOf("Q");
					eeIndex = curLine.indexOf("E");
					if(insIndex == -1 || qtrIndex == -1 || eeIndex == -1) {
						System.err.println("In readDataFromFile, err in reading the number line");
						System.exit(0);						
					}
					strNumInspection = curLine.substring(insIndex+1, qtrIndex);
					strNumQtrNC = curLine.substring(qtrIndex+1, eeIndex);
					strNumEE = curLine.substring(eeIndex+1, curLine.length());
					curNumInspection += convertNumInspection(strNumInspection);
					curNumQtrNC += convertNumQtrNC(strNumQtrNC);
					curNumEE += convertNumEE(strNumEE);						
				}//end of the inner while
				Facility curFacility = new Facility(curID, curName, curAddressLine1, curAddressLine2,
						curNumInspection, curNumQtrNC, curNumEE);
				facilities.put(IDForMap++, curFacility);				
			}//end of the outer while
		}
		catch (Exception e) {
			e.printStackTrace();
		}		
		
	}
	
	private void printFacilitiesToFile(String fileName){
		BufferedWriter out=null;
		try {
			out = new BufferedWriter(new FileWriter(fileName));
			System.out.println("HashMap of Facilities");
			Iterator itrOut = facilities.entrySet().iterator();  
	        while (itrOut.hasNext()) {  
	        	Map.Entry entryOut = (Map.Entry)itrOut.next();
	        	//Integer ID = (Integer)entryOut.getKey();
	        	Facility curFacility = (Facility)entryOut.getValue();
	        	curFacility.printToFile(out);        	
	        }
	        
		} catch (IOException e) {
			System.out.println("printFacilitiesToFile, err");
			e.printStackTrace();
		} finally {
            //Close the BufferedWriter			
            try {            	
                if (out != null) {
                	out.flush();
                	out.close();
                }
            } catch (IOException ex) {
            	System.out.println("In printFacilitiesToFile, closing the BufferedWriter");
                ex.printStackTrace();
            }
        }		
	}
	
	
	private int convertNumInspection(String strNumInspection){
		int valueNumInspection;
		if(strNumInspection.compareTo("&nbsp;")==0)
			valueNumInspection = 0;
		else
			//to copy with the special format
			valueNumInspection = Integer.parseInt(strNumInspection.substring(3));		
		
		return valueNumInspection;		
	}
	
	private int convertNumQtrNC(String strNumQtrNC){
		int valueNumQtrNC;		
		if(strNumQtrNC.compareTo("&nbsp;")==0 || strNumQtrNC.compareTo("n/a")==0)
			valueNumQtrNC = 0;
		else
		{
			int j=0;
			for(j=0; j<strNumQtrNC.length(); j++){
				if(!Character.isWhitespace(strNumQtrNC.charAt(j)))
							break;		
			}
			valueNumQtrNC = Integer.parseInt(strNumQtrNC.substring(j));	    		 
		}
		//to copy with the special format
			
		
		return valueNumQtrNC;		
	}
	
	private int convertNumEE(String strNumEE){
		int valueNumEE;		
		if(strNumEE.indexOf("&nbsp")!=-1 || 
				strNumEE.indexOf("no limit") !=-1 || strNumEE.indexOf("incomp")!=-1)
			valueNumEE = 0;
		else
			valueNumEE = Integer.parseInt(strNumEE);
		
		return valueNumEE;		
	}
	
	private void pythonExe(String script, String[] scriptArgs, int argLength){
		Runtime rt = Runtime.getRuntime();
		String[] cmd = new String[argLength+2];
		cmd[0] = "python";
		cmd[1] = script;
		//Get script arguments, e.g. cmd[2] = Filepath;
		for(int i=0;i<argLength;i++)
			cmd[i+2] = scriptArgs[i];
		try {
			Process pr = rt.exec(cmd);
	        pr.waitFor();
	        pr.destroy();
		} catch (IOException e) {
			System.err.println("In pythonExe, IOException: " + e);
			e.printStackTrace();
		} catch (InterruptedException e) {
			System.err.println("In pythonExe, InterruptedException: " + e);
			e.printStackTrace();
		}		
	}

	protected void startFetch(String zipCode) {		
		String curDir = upMostDir+zipCode;
		String commContent = searchByZipContent+zipCode+zipPostFix+zipCode;
		//output file
		String searchByZipResult = curDir+"/searchByZipResult";
		//Step 1
		//doCommunication(1, searchByZipTarget, commContent, searchByZipResult);
		//invoke python script
		String curArgs[] = new String [2]; 
		curArgs[0] = searchByZipResult;
		curArgs[1] = curDir;
		//Step 1
		//pythonExe(scriptExtractSearchResult, curArgs, 2);
		//
		String soupDataPath = curDir+soupDataFile;
		//Step 3
		getFacilityFromFile(soupDataPath);
		//
		String addressPath = curDir+soupAddressFile;
		String geoPath = curDir+geoDataFile;
		//getLocation(addressPath, geoPath);		
		//getGeoFromXML(geoPath);
		//
		queryFacilityPages(zipCode);
		//
		String facilitiesFileTest = upMostDir+zipCode+"/facilitiesTest";
		printFacilitiesToFile(facilitiesFileTest);	
		//
		queryOCVPages(zipCode);
		
	}
	
	void startQuery(String zipCode){
		//mkdir
		mkDir(upMostDir+zipCode);
		//prepare to start the communication
		startFetch(zipCode);
		//
		String facilitiesFile = upMostDir+zipCode+"/facilities";
		printFacilitiesToFile(facilitiesFile);	
		
	}
	


	/**
	 * @param args
	 */
	public static void main(String[] args) {
		EpaDataAgent dataAgent = new EpaDataAgent();
		EpaUtil util = new EpaUtil();
		//dataAgent.startQuery("12208");//12208 12180
		

		/*
		//download OCV html
		String ocvHtml = "/home/ping/research/python/water/CgiSoupOutput/temp/"+OCVHtmlPre+"NY0261343";
		String target = "http://www.epa-echo.gov/cgi-bin/effluents.cgi?permit=NY0261343&amp;charts=viols&amp;monlocn=all&amp;outt=all";
		String getTarget = target.replace("&amp;", "&");
		//System.out.println(getTarget);
		dataAgent.doCommunication(0, getTarget, getContent, ocvHtml);
		*/
		
		//download solids html
		String solidsHtml = "/home/ping/research/python/water/CgiSoupOutput/temp/"+SolidsHtmlPre+"NY0261343";
		String solidsTarget = "http://www.epa-echo.gov"+
			"/cgi-bin/effluent1.cgi?permit=NY0261343&pipe=001&paramtr=00530&monlocn=1&period=1&outt=all&date=20070701%7C20100630&charts=viol&tool=echo";
		dataAgent.commAgent.doCommunication(0, solidsTarget, getContent, solidsHtml);
		
		/*
		 * test procFacilityPage
		Facility fac = new Facility("110012303854");
		dataAgent.procFacilityPage(fac);
		fac.printFacility();
		*/
		
		/*
		 * test dataAgent.getDataFromFacilitySoup
		Facility fac = new Facility("110012303854");		
		dataAgent.getDataFromFacilitySoup("/home/ping/research/python/water/fac/epaFacSoup110012303854",
				fac);
		fac.printFacility();
		*/
		/*
		String tmp = "FRS ID: 110004374748\n";
		//output: 110004374748\nTestDone
		//String tmp2 = tmp.substring(tmp.indexOf(':')+2);
		//output: 110004374748TestDone
		String tmp2 = tmp.substring(tmp.indexOf(':')+2, tmp.length()-1);
		System.out.print(tmp2);
		System.out.println("TestDone");
		*/
		/*
		String curLine = "I&nbsp;Qn/aEno limit data"+"\n";
		int insIndex = curLine.indexOf("I");
		int qtrIndex = curLine.indexOf("Q");
		int eeIndex = curLine.indexOf("E");
		if(insIndex == -1 || qtrIndex == -1 || eeIndex == -1) {
			System.err.println("In readDataFromFile, err in reading the number line");
			System.exit(0);						
		}
		String strNumInspection = curLine.substring(insIndex+1, qtrIndex);
		String strNumQtrNC = curLine.substring(qtrIndex+1, eeIndex);
		String strNumEE = curLine.substring(eeIndex+1, curLine.length()-1);
		System.out.print(strNumInspection);
		System.out.print(strNumQtrNC);
		System.out.print(strNumEE);
		System.out.println("TestDone");
		*/
		/*
		String curLine = "javascript: void window.open('http://www.epa-echo.gov/cgi-bin/effluents.cgi?permit=NY0261343&charts=viols&monlocn=all&outt=all','','height=480,width=800,resizable=yes,scrollbars=yes,menubar=yes,toolbar=yes,screenX=10,screenY=10')\n";
		int httpIndex = curLine.indexOf("http:");
		String linkChartsWithViolations = curLine.substring(httpIndex,
				curLine.indexOf('\'', httpIndex));
		System.out.print(linkChartsWithViolations);
		*/
		
		/*		
		 * //test if an obj in 2 lists are the same obj
		Facility fac1 = new Facility("100000000001");
		Facility fac2 = new Facility("100000000002");
		Facility fac3 = new Facility("100000000003");
		ArrayList<Facility> facList1 = new ArrayList<Facility> ();
		ArrayList<Facility> facList2 = new ArrayList<Facility> ();
		facList1.add(fac1);
		facList1.add(fac2);
		facList1.add(fac3);
		facList2.add(fac1);
		facList2.add(fac2);
		util.printFacilityArrayList(facList1, 
		"/home/ping/research/python/water/CgiSoupOutput/temp/facList1");
		util.printFacilityArrayList(facList2, 
		"/home/ping/research/python/water/CgiSoupOutput/temp/facList2");
		fac1.setOCVLink("abc");
		util.printFacilityArrayList(facList1, 
		"/home/ping/research/python/water/CgiSoupOutput/temp/changedfacList1");
		util.printFacilityArrayList(facList2, 
		"/home/ping/research/python/water/CgiSoupOutput/temp/changedfacList2");
		 */

	}

}
