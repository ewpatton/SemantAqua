package test;

import org.junit.Test;

import edu.rpi.tw.escience.waterquality.query.Query.SortType;
import edu.rpi.tw.escience.waterquality.query.Query.Type;
import junit.framework.TestCase;

public class QueryTest extends TestCase {
	@Test
	public void testQueryNamespace() {
		@SuppressWarnings("unused")
		Type temp = null;
		temp = Type.SELECT;
		temp = Type.CONSTRUCT;
		temp = Type.DESCRIBE;
		temp = Type.ASK;
		@SuppressWarnings("unused")
		SortType temp2 = null;
		temp2 = SortType.ASC;
		temp2 = SortType.DESC;
	}
}
