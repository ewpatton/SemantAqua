package edu.rpi.tw.escience.waterquality;

<<<<<<< HEAD
import java.io.File;
import java.io.IOException;
=======
import java.io.IOException;
import java.io.InputStream;
>>>>>>> github/develop
import java.io.PrintStream;
import java.util.Properties;

import javax.servlet.ServletConfig;
<<<<<<< HEAD
import javax.servlet.ServletContext;
=======
>>>>>>> github/develop
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

<<<<<<< HEAD
import org.apache.log4j.BasicConfigurator;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import edu.rpi.tw.escience.waterquality.impl.ModuleManagerFactory;
import edu.rpi.tw.escience.waterquality.util.JavaScriptGenerator;
import edu.rpi.tw.escience.waterquality.util.SemantAquaConfiguration;

=======
>>>>>>> github/develop
@WebServlet(name="SemantAqua",
			urlPatterns={"/rest/*","/js/modules/*","/js/config.js"},
			description="SemantAqua Portal",
			displayName="SemantAqua")
public class SemantAquaServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = -5803626987887478846L;
	
<<<<<<< HEAD
	private Properties props = new Properties();
	
	private static final int HTTP_PORT = 80;
	private static final int HTTPS_PORT = 443;
	
	private Logger log = null;
=======
	private static final String PROPERTIES = "/WEB-INF/classes/semantaqua.properties";
	
	private Properties props = new Properties();
	
	private static boolean debugging = false;
>>>>>>> github/develop
	
	@Override
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
<<<<<<< HEAD
		initLogger(config);
		log.info("Initializing SemantAqua");
		log.debug("Running on servlet version: "+getServletContext().getMajorVersion());
		log.debug("Servlet context path: "+getServletContext().getContextPath());
		SemantAquaConfiguration.configure(getServletContext());
		final String webinf = config.getServletContext().getRealPath("WEB-INF");
		log.debug("WEB-INF: "+webinf);
		File modules = new File(webinf+"/modules");
		if(!modules.exists()) {
			log.info("Creating modules directory");
			modules.mkdir();
		}
		ModuleManagerFactory.getInstance().setModulePath(modules.getAbsolutePath());
		log.info("Finished initializing SemantAqua");
	}
	
	private void initLogger(ServletConfig config) {
		String log4jconfig = config.getInitParameter("log4j-properties-location");
		ServletContext context = config.getServletContext();
		if(log4jconfig == null) {
			BasicConfigurator.configure();
		}
		else {
			String appPath = context.getRealPath("/");
			String log4jpath = appPath + log4jconfig;
			if(new File(log4jpath).exists()) {
				PropertyConfigurator.configure(log4jpath);
				log = Logger.getLogger(SemantAquaServlet.class);
			}
			else {
				BasicConfigurator.configure();
			}
=======
		getServletContext().log("Initializing SemantAqua");
		getServletContext().log("Running on servlet version: "+getServletContext().getMajorVersion());
		getServletContext().log("Servlet context path: "+getServletContext().getContextPath());
		try {
			InputStream is = getServletContext().getResourceAsStream(PROPERTIES);
			if(is != null) {
				props.load(is);
				if(props.getProperty("debug", "false").equals("true")) {
					debugging = true;
				}
			}
			else {
				throw new IOException("Unable to get resource "+PROPERTIES);
			}
		} catch (IOException e) {
			getServletContext().log("Unable to load "+PROPERTIES, e);
>>>>>>> github/develop
		}
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
<<<<<<< HEAD
		log.debug(request.getScheme());
		log.debug(request.getServerName());
		log.debug(""+request.getServerPort());
		log.debug(request.getContextPath());
		log.debug(request.getServletPath());
		log.debug(request.getPathInfo());
		log.debug(request.getRequestURI());
=======
		getServletContext().log(request.getScheme());
		getServletContext().log(request.getServerName());
		getServletContext().log(""+request.getServerPort());
		getServletContext().log(request.getContextPath());
		getServletContext().log(request.getServletPath());
		getServletContext().log(request.getPathInfo());
		getServletContext().log(request.getRequestURI());
>>>>>>> github/develop
		PrintStream ps = null;
		if(request.getServletPath().equals("/js/config.js")) {
			printConfig(request, response);
		}
<<<<<<< HEAD
		else if(request.getServletPath().equals("/js/modules")) {
			printAjax(request, response);
		}
=======
>>>>>>> github/develop
		else {
			ps = new PrintStream(response.getOutputStream());
			ps.println("<h1>It works!</h1>");
			ps.close();
		}
	}
	
	@Override
	public String getServletInfo() {
<<<<<<< HEAD
		getServletContext().getResourceAsStream("/META-INF/maven/edu.rpi.tw.escience/semantauqa/pom.properties");
=======
		getServletConfig().getServletContext().getResourceAsStream("/META-INF/maven/edu.rpi.tw.escience/semantauqa/pom.properties");
>>>>>>> github/develop
		return "SemantAqua";
	}
	
	@Override
	public long getLastModified(HttpServletRequest request) {
		return -1;
	}
	
	private void printConfig(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setHeader("Content-Type", "text/javascript");
		PrintStream ps = new PrintStream(response.getOutputStream());
		String baseUrl = computeBaseUrl(request);
<<<<<<< HEAD
		if(SemantAquaConfiguration.get().isDebug()) {
=======
		if(isDebug()) {
>>>>>>> github/develop
			ps.println("// file autogenerated by "+getClass().getName()+"#printConfig");
		}
		ps.println("var SemantAqua = { \"baseUrl\": \""+baseUrl+"\", \"restBaseUrl\": \""+baseUrl+"rest/\" }");
		ps.close();
	}
	
<<<<<<< HEAD
	private void printAjax(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setHeader("Content-Type", "text/javascript");
		PrintStream ps = new PrintStream(response.getOutputStream());
		String module = request.getPathInfo().replace("/", "").replace(".js", "");
		ModuleManager mgr = ModuleManagerFactory.getInstance().getManager();
		Module mod = mgr.getModuleByName(module);
		if(mod != null) {
			ps.println(JavaScriptGenerator.ajaxForModule(mod));
		}
		ps.close();
	}
	
=======
>>>>>>> github/develop
	private String computeBaseUrl(HttpServletRequest request) {
		if(props.contains("baseUrl") && !props.get("baseUrl").equals("")) {
			return props.getProperty("baseUrl");
		}
		else {
			String path = "";
			path += request.getScheme();
			path += "://";
			path += request.getServerName();
<<<<<<< HEAD
			if(request.getScheme().equals("http") && request.getServerPort() != HTTP_PORT) {
				path += ":"+request.getServerPort();
			}
			else if(request.getScheme().equals("https") && request.getServerPort() != HTTPS_PORT) {
=======
			if(request.getScheme().equals("http") && request.getServerPort() != 80) {
				path += ":"+request.getServerPort();
			}
			else if(request.getScheme().equals("https") && request.getServerPort() != 443) {
>>>>>>> github/develop
				path += ":"+request.getServerPort();
			}
			path += request.getContextPath();
			path += "/";
			return path;
		}
	}
<<<<<<< HEAD
=======
	
	public static boolean isDebug() {
		return debugging;
	}
>>>>>>> github/develop

}
