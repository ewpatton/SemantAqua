package edu.rpi.tw.eScience.WaterQualityPortal.oboe;

import com.hp.hpl.jena.ontology.Individual;
import com.hp.hpl.jena.ontology.OntModel;
import com.hp.hpl.jena.ontology.OntProperty;
import com.hp.hpl.jena.rdf.model.Model;

import edu.rpi.tw.eScience.WaterQualityPortal.model.Ontology;

public class LiteralMeasurement extends Measurement {

	public LiteralMeasurement(int curId, String curCharUri, String curValue,
			String curstandardUri) {
		super(curId, curCharUri, curValue, curstandardUri);
	}

	public Individual asIndividual(OntModel owlModel, Model pmlModel) {
		
		Individual m = owlModel.createIndividual(OBOEOntology.OBOE.CORE.NS+"Measurement"+id, Ontology.Measurement(owlModel));
		//for adding properties
		OntProperty prop;
		
		// hasValue
		//we only support value as literal
		prop = OBOEOntology.hasValue(owlModel);
		m.addLiteral(prop, value);
		
		// ofCharacteristic
		prop = OBOEOntology.ofCharacteristic(owlModel);
		Individual charac = owlModel.createIndividual(characteristicUri, OBOEOntology.Characteristic(owlModel));
		m.addProperty(prop, charac);
		
		// usesStandard
		prop = OBOEOntology.usesStandard(owlModel);
		Individual standard = owlModel.createIndividual(standardUri, OBOEOntology.Standard(owlModel));
		m.addProperty(prop, standard);
		
		return m;
	}
}
