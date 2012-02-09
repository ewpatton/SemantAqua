package edu.rpi.tw.eScience.SemantAqua.WebService;

public interface CachingQueryEngine extends QueryEngine {
	public void setCache(Cache cache);
	public Cache getCache();
}
