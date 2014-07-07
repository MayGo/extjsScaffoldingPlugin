import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import groovy.text.SimpleTemplateEngine
import groovy.text.Template

import org.codehaus.groovy.grails.commons.GrailsDomainClass
import org.codehaus.groovy.grails.commons.GrailsDomainClassProperty
import org.codehaus.groovy.grails.plugins.GrailsPluginInfo
import org.codehaus.groovy.grails.plugins.GrailsPluginManager
import org.codehaus.groovy.grails.plugins.GrailsPluginUtils
import org.codehaus.groovy.grails.scaffolding.AbstractGrailsTemplateGenerator
import org.codehaus.groovy.grails.scaffolding.AbstractGrailsTemplateGenerator.GrailsControllerType;
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.core.io.support.PathMatchingResourcePatternResolver
import org.springframework.util.Assert
import org.codehaus.groovy.runtime.IOGroovyMethods;
import org.springframework.util.StringUtils;

/**
 * implementation of the generator that generates extjs artifacts (controllers, models, store, views etc.)
 * from the domain model.
 *
 * @author Maigo Erit
 */
class ExtjsTemplateGenerator extends AbstractGrailsTemplateGenerator {
	
	static EXTJS_APP_DIR = "extjs/app/"
	static EXTJS_VIEW_DIR = EXTJS_APP_DIR + "view/"
	static EXTJS_VIEW_MAIN_DIR = EXTJS_VIEW_DIR+"main/"
	static EXTJS_STORE_DIR = EXTJS_APP_DIR + "store/"
	static EXTJS_MODEL_DIR = EXTJS_APP_DIR + "model/"
	static EXTJS_CONTROLLER_DIR = EXTJS_APP_DIR + "controller/"

	ExtjsTemplateGenerator(ClassLoader classLoader) {
		super(classLoader)
	}

	@Override
	public void generateViews(GrailsDomainClass domainClass, String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		File viewsDir = new File(destDir, EXTJS_VIEW_DIR + domainClass.getPropertyName());
		if (!viewsDir.exists()) {
			viewsDir.mkdirs();
		}

		for (String name : getTemplateNames()) {
			if (log.isInfoEnabled()) {
				log.info("Generating [" + name + "] view for domain class [" + domainClass.getFullName() + "]");
			}
			generateView(domainClass, name, viewsDir.getAbsolutePath());
		}
	}

	@Override
	public void generateView(GrailsDomainClass domainClass, String viewName, Writer out) throws IOException {
		String templateText = getTemplateText(viewName + ".js");
		if (!StringUtils.hasLength(templateText)) {
			return;
		}

		GrailsDomainClassProperty multiPart = null;
		for (GrailsDomainClassProperty property : domainClass.getProperties()) {
			if (property.getType() == Byte[].class || property.getType() == byte[].class) {
				multiPart = property;
				break;
			}
		}

		String packageName = StringUtils.hasLength(domainClass.getPackageName()) ? "<%@ page import=\"" + domainClass.getFullName() + "\" %>" : "";
		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", packageName);
		binding.put("multiPart", multiPart);
		binding.put("propertyName", getPropertyName(domainClass));
		binding.put("appName", grailsApplication.metadata['app.name']);
		
		

		generate(templateText, binding, out);
	}

	@Override
	public void generateView(GrailsDomainClass domainClass, String viewName, String destDir) throws IOException {
		File destFile = new File(destDir, viewName + ".js");
		if (!canWrite(destFile)) {
			return;
		}

		BufferedWriter writer = null;
		try {
			writer = new BufferedWriter(new FileWriter(destFile));
			generateView(domainClass, viewName, writer);
			try {
				writer.flush();
			}
			catch (IOException ignored) {

			}
		}
		finally {
			IOGroovyMethods.closeQuietly(writer);
		}
	}


	@Override
	protected Set<String> getTemplateNames() throws IOException {

		if (resourceLoader != null && grailsApplication.isWarDeployed()) {
			//NOT NEEDED REALLY
			try {
				PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(resourceLoader);
				return extractNames(resolver.getResources("/WEB-INF/templates/scaffolding/*.js"));
			}
			catch (Exception e) {
				return Collections.emptySet();
			}
		}

		PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
		Set<String> resources = new HashSet<String>();

		String templatesDirPath = basedir + "/src/templates/scaffolding";
		Resource templatesDir = new FileSystemResource(templatesDirPath);
		if (templatesDir.exists()) {
			try {
				resources.addAll(extractNames(resolver.getResources("file:" + templatesDirPath + "/*.js")));
			}
			catch (Exception e) {
				log.error("Error while loading views from " + basedir, e);
			}
		}

		File pluginDir = getPluginDir();
		try {
			resources.addAll(extractNames(resolver.getResources("file:" + pluginDir + "/src/templates/scaffolding/*.js")));
		}
		catch (Exception e) {
			// ignore
			log.error("Error locating templates from " + pluginDir + ": " + e.getMessage(), e);
		}

		return resources;
	}
	
	@Override
	protected File getPluginDir() throws IOException {
		GrailsPluginInfo info = GrailsPluginUtils.getPluginBuildSettings().getPluginInfoForName("extjs-scaffolding");
		return info.getDescriptor().getFile().getParentFile();
	}

	def renderEditor = { GrailsDomainClassProperty property ->
		def domainClass = property.domainClass
		def cp
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
		if (hasHibernate) {
			cp = domainClass.constrainedProperties[property.name]
		}

		if (!renderEditorTemplate) {
			// create template once for performance
			renderEditorTemplate = engine.createTemplate(getTemplateText('renderEditor.template'))
		}

		def binding = [
			pluginManager: pluginManager,
			property: property,
			domainClass: domainClass,
			cp: cp,
			domainInstance:getPropertyName(domainClass)]
		return renderEditorTemplate.make(binding).toString()
	}
	
	@Override
	protected Set<String> extractNames(Resource[] resources) {
		Set<String> names = new HashSet<String>();
		for (Resource resource : resources) {
			String name = resource.getFilename();
			if(name.split("\\.").size()==2)
				names.add(name.split("\\.")[0]);
		}

		return names;
	}
	
	
	
	
	
	
	
	public void generateModel(GrailsDomainClass domainClass, String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		if (domainClass == null) {
			return;
		}

		String fullName = domainClass.getFullName();
		String pkg = "";
		int pos = fullName.lastIndexOf('.');
		if (pos != -1) {
			// Package name with trailing '.'
			pkg = fullName.substring(0, pos + 1);
		}

		File destFile = new File(destDir, EXTJS_MODEL_DIR +
				domainClass.getShortName() + ".js");
		if (canWrite(destFile)) {
			destFile.getParentFile().mkdirs();

			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(destFile));
				generateModel(domainClass, writer);
				try {
					writer.flush();
				} catch (IOException ignored) {}
			}
			finally {
				IOGroovyMethods.closeQuietly(writer);
			}

			log.info("Controller generated at [" + destFile + "]");
		}
	}
	
	protected void generateModel(GrailsDomainClass domainClass, Writer out) throws IOException {
		String templateText = getTemplateText("Model.template.js");
		

		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", domainClass.getPackageName());
		binding.put("propertyName", getPropertyName(domainClass));
		binding.put("appName", grailsApplication.metadata['app.name']);

		generate(templateText, binding, out);
	}
	
	
	
	
	
	
	
	
	
	public void generateStore(GrailsDomainClass domainClass, String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		if (domainClass == null) {
			return;
		}

		String fullName = domainClass.getFullName();
		String pkg = "";
		int pos = fullName.lastIndexOf('.');
		if (pos != -1) {
			// Package name with trailing '.'
			pkg = fullName.substring(0, pos + 1);
		}

		File destFile = new File(destDir, EXTJS_STORE_DIR +
				domainClass.getShortName() + "List.js");
		if (canWrite(destFile)) {
			destFile.getParentFile().mkdirs();

			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(destFile));
				generateStore(domainClass, writer);
				try {
					writer.flush();
				} catch (IOException ignored) {}
			}
			finally {
				IOGroovyMethods.closeQuietly(writer);
			}

			log.info("Controller generated at [" + destFile + "]");
		}
	}
	
	protected void generateStore(GrailsDomainClass domainClass, Writer out) throws IOException {
		String templateText = getTemplateText("Store.template.js");
		

		Map<String, Object> binding = createBinding(domainClass);
		binding.put("packageName", domainClass.getPackageName());
		binding.put("propertyName", getPropertyName(domainClass));
		binding.put("appName", grailsApplication.metadata['app.name']);

		generate(templateText, binding, out);
	}
	
	
	/**
	 * Generate static files 
	 * @param destDir
	 * @throws IOException
	 */
	public void generateStatics(String destDir) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		["Root.template.js"].each{
			generateStatic(destDir, EXTJS_CONTROLLER_DIR + it.replace(".template", ""), it)
		}
		
		["Main.template.js", "MainController.template.js", "MainModel.template.js"].each{
			generateStatic(destDir, EXTJS_VIEW_MAIN_DIR + it.replace(".template", ""), it)
		}
		
		["Application.template.js"].each{
			generateStatic(destDir, EXTJS_APP_DIR + it.replace(".template", ""), it)
		}
		
		["Base.template.js"].each{
			generateStatic(destDir, EXTJS_MODEL_DIR + it.replace(".template", ""), it)
		}
	
	}
	
	public void generateStatic(String destDir, String fileName, String templateName) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		File destFile = new File(destDir, fileName);
		if (canWrite(destFile)) {
			destFile.getParentFile().mkdirs();

			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(destFile));
				generateStatic(writer, templateName);
				try {
					writer.flush();
				} catch (IOException ignored) {}
			}
			finally {
				IOGroovyMethods.closeQuietly(writer);
			}

			log.info("Controller generated at [" + destFile + "]");
		}
	}
	
	protected void generateStatic(Writer out, templateName) throws IOException {
		String templateText = getTemplateText(templateName);

		Map<String, Object> binding = new HashMap<String, Object>();
		binding.put("appName", grailsApplication.metadata['app.name']);
		def domainClasses = grailsApplication.domainClasses
		binding.put("domainClasses", domainClasses);

		generate(templateText, binding, out);
	}


	@Override
	public void generateController(GrailsControllerType controllerType, GrailsDomainClass domainClass, String destDir) throws IOException {
		
	}

	@Override
	public void generateController(GrailsDomainClass domainClass, String destDir) throws IOException {
		
	}

	@Override
	public void generateRestfulController(GrailsDomainClass domainClass, String destDir) throws IOException {
		
	}

	@Override
	public void generateAsyncController(GrailsDomainClass domainClass, String destDir) throws IOException {
		
	}
	
}