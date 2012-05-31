package edu.rpi.tw.eScience.WaterQualityPortal.oboe;

import com.hp.hpl.jena.ontology.OntClass;
import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.ontology.OntProperty;
import com.hp.hpl.jena.rdf.model.Model;
import com.hp.hpl.jena.rdf.model.Resource;

import edu.rpi.tw.eScience.WaterQualityPortal.model.Ontology.EPA;
import edu.rpi.tw.eScience.WaterQualityPortal.model.Ontology.SWEET;

public class OBOEOntology {
	
	
	/*	    
		public static final String NS="http://ecoinformatics.org/oboe/oboe.1.0/oboe.owl#";
		public static final String CoreNS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-core.owl#";
		public static final String CharNS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-characteristics.owl#";
		public static final String StandardsNS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-standards.owl#";*/
	
	public static class OBOE {
		public static class CORE {
			public static final String NS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-core.owl#";
			
			// Classes
			public static final String Measurement=NS+"Measurement";
			public static final String Observation=NS+"Observation";
			public static final String Characteristic=NS+"Characteristic";
			public static final String Standard=NS+"Standard";
			public static final String Unit=NS+"Unit";
			public static final String Entity=NS+"Entity";
			//Properties of Measurement
			public static final String ofCharacteristic=NS+"ofCharacteristic";	
			public static final String usesStandard=NS+"usesStandard";	
			public static final String hasValue=NS+"hasValue";	
			//Properties of Observation
			public static final String ofEntity=NS+"ofEntity";	
			public static final String hasMeasurement=NS+"hasMeasurement";	
			public static final String hasContext=NS+"hasContext";	
			
		}
		
		public static class CHARACTERISTICS {
			public static final String NS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-characteristics.owl#";
			
			// Classes
			public static final String AmountOfSubstanceConcentration=NS+"AmountOfSubstanceConcentration";
		}

		public static class STANDARDS {
			public static final String NS="http://ecoinformatics.org/oboe/oboe.1.0/oboe-standards.owl#";
			
			// Classes
			
			public static final String MilligramPerLiter=NS+"MilligramPerLiter";
		}	
	}	
	
	public static class OBOE_POLLUTION {
		public static final String NS="http://escience.rpi.edu/ontology/semanteco/2/0/oboe-pollution.owl#";
		
		// Classes
		// Properties
		public static final String hasValue=NS+"hasValue";
	}	
	
	public static OntClass Measurement(OntModel m) {
		return m.createClass(OBOE.CORE.Measurement);
	}
	
	public static OntClass Characteristic(OntModel m) {
		return m.createClass(OBOE.CORE.Characteristic);
	}
	
	public static OntClass Standard(OntModel m) {
		return m.createClass(OBOE.CORE.Standard);
	}
	
	public static OntClass Observation(OntModel m) {
		return m.createClass(OBOE.CORE.Observation);
	}
	
	public static OntClass Entity(OntModel m) {
		return m.createClass(OBOE.CORE.Entity);
	}
	//not sure if hasValue should be a datatype property or an object property
	/*
	 * public static OntProperty hasValue(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.hasValue);
	}
	*/
	
	public static OntProperty hasValue(OntModel m) {
		return m.createDatatypeProperty(OBOE_POLLUTION.hasValue);
	}
	
	public static OntProperty usesStandard(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.usesStandard);
	}
	
	public static OntProperty ofCharacteristic(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.ofCharacteristic);
	}
	
	public static OntProperty ofEntity(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.ofEntity);
	}
	
	public static OntProperty hasMeasurement(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.hasMeasurement);
	}
	
	public static OntProperty hasContext(OntModel m) {
		return m.createObjectProperty(OBOE.CORE.hasContext);
	}
}
