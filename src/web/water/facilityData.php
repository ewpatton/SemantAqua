<?php


if(isset($_REQUEST['state'])&&$_REQUEST['state']!=""&&isset($_REQUEST['county'])&&$_REQUEST['county']!=""&&isset($_REQUEST['type'])&&$_REQUEST['type']!=""&&isset($_REQUEST['source'])&&$_REQUEST['source']!=""){
 
  $source=$_REQUEST['source'];
  $county=$_REQUEST['county'];
  if(strlen($county)==1){
    $county="00".$county;
  }
  else if(strlen($county)==2){
    $county="0".$county;
  }


  $state=strtoupper($_REQUEST['state']);
  $offset="0";
  $limit="2000";
  if(isset($_REQUEST['start'])&&$_REQUEST['start']!=""){
    $offset=$_REQUEST['start'];
  }
  if(isset($_REQUEST['limit'])&&$_REQUEST['limit']!=""){
    $limit=$_REQUEST['limit'];
  }
  

  $type=$_REQUEST['type'];
  $query="";
  if($type=="ViolatingFacility"){
    $query="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> construct{?s a this:ViolatingFacility. ?s this:hasPermit ?per. ?v this:hasPermit ?per. ?s this:hasMeasurement ?v. ?v rdf:type this:Violation. ?v this:hasElement ?e. ?s geo:lat ?lat. ?s geo:long ?log. ?s rdfs:label ?label. } where{graph<http://tw2.tw.rpi.edu/water/".$source."/".$state.">{?s a this:ViolatingFacility. ?s this:hasPermit ?per. ?v rdf:type this:Violation. ?v this:hasPermit ?per. ?v this:hasElement ?e. ?s geo:lat ?lat. ?s geo:long ?log. ?s rdfs:label ?label. ?s this:hasCountyCode \"".$state.$county."\". filter(?lat != 0 && ?log != 0)}}";

  }
  else if($type=="facility"){
    $query="prefix  rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> prefix this: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#> prefix geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> construct{?s a this:Facility. ?s geo:lat ?lat. ?s geo:long ?log. ?s rdfs:label ?label.} where{graph<http://tw2.tw.rpi.edu/water/".$source."/".$state.">{?s a this:Facility . ?s rdfs:label ?label . ?s geo:lat ?lat . ?s geo:long ?log . ?s this:hasCountyCode \"".$state.$county."\". filter(?lat != 0 && ?log != 0)}}";
  }
  else if($type=="measurement"){
     $query=   "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>".
   "PREFIX epa: <http://tw2.tw.rpi.edu/zhengj3/owl/epa.owl#>".
   "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>".
   "PREFIX time: <http://www.w3.org/2006/time#>".
   "PREFIX owl: <http://www.w3.org/2002/07/owl#>".
   "PREFIX foaf: <http://xmlns.com/foaf/0.1/>".
   "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>".
   "PREFIX list: <http://jena.hpl.hp.com/ARQ/list#>".
   "PREFIX dcterms: <http://purl.org/dc/terms/>".
   "CONSTRUCT {".
   "?s epa:hasPermit ?permit. ".
   "?s epa:hasMeasurement ?measurement. ".
   "?measurement rdf:type epa:Violation. ".
   "?measurement epa:hasLimitOperator ?operator. ".
   "?measurement rdf:value ?value. ".
   "?measurement epa:hasLimitValue ?limit. ".
   "?measurement epa:hasElement ?element. ".
   "?measurement epa:hasUnit ?unit. ".
   "?measurement dcterms:date ?date. ".
   "} WHERE { GRAPH <http://tw2.tw.rpi.edu/water/".$source."/".$state.">".
   "{?s epa:hasMeasurement ?measurement. ".
   "?s epa:hasPermit ?permit. ".
   "?measurement rdf:type epa:Violation. ".
   "?measurement epa:hasLimitOperator ?operator. ".
   "?measurement rdf:value ?value. ".
   "?measurement epa:hasLimitValue ?limit. ".
   "?measurement epa:hasElement ?element. ".
   "?measurement epa:hasUnit ?unit. ".
   "?measurement dcterms:date ?date. ".
       "}}ORDER BY DESC(?date) ";

  }

  $service="http://sparql.tw.rpi.edu/virtuoso/sparql";
  $url=$service."?default-graph-uri=&should-sponge=&query=".urlencode($query)."&format=application%2Frdf%2Bxml&debug=on&timeout=";

  //$service="http://tw2.tw.rpi.edu/zhengj3/water_store/ARC2store/sparql.php";
  //$url=$service."?query=".urlencode($query)."&output=&jsonp=&key=";

  if(isset($_REQUEST['debug'])){
    $query=str_replace("<","&lt;",$query);
    $query=str_replace(">","&gt;",$query);
     echo $query;
  echo $url;
     return;

  }
  $data=@file_get_contents($url);
  

 $data=preg_replace("/<br \/>.*/","",$data);  
  $data=preg_replace("/<b>.*<\/b>/","",$data);



  $data=str_replace("<ns0:hasValue>","<ns0:hasValue rdf:datatype=\"http://www.w3.org/2001/XMLSchema#decimal\">",$data);
  
  header("Content-type: text/xml");
  $data=str_replace("\n","",$data);
  echo $data;
  
 }

if(isset($_REQUEST['query'])&&$_REQUEST['query']!="")
  {


    $query=$_REQUEST['query'];

    $service="http://tw2.tw.rpi.edu/zhengj3/water_store/ARC2store/sparql.php";
    $url=$service."?query=".urlencode($query)."&output=json&jsonp=&key=";
    if(isset($_REQUEST['debug'])){
      $query=str_replace("<","&lt;",$query);
      $query=str_replace(">","&gt;",$query);
      echo $query;
      return;
      //echo $url;
    }
    $data=@file_get_contents($url);


    $data=preg_replace("/<br \/>.*/","",$data);
    $data=preg_replace("/<b>.*<\/b>/","",$data);
    $data=str_replace("\n","",$data);


    header("Content-type: application/json");

    echo $data;

  }

?>
