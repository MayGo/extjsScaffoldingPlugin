import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Writer;
import java.nio.file.Path
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

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

import groovy.io.FileType
import grails.util.Holders
import java.nio.file.Paths

/**
 * implementation of the generator that generates extjs artifacts (controllers, models, store, views etc.)
 * from the domain model.
 *
 * @author Maigo Erit
 */
class ExtjsTemplateGenerator extends AbstractGrailsTemplateGenerator {

	static EXTJS_DIR = Holders.config.extJsExportLocation?:"extjs/"
	static EXTJS_APP_DIR = EXTJS_DIR+"app/"
	static EXTJS_VIEW_DIR = EXTJS_APP_DIR + "view/"
	static EXTJS_VIEW_MAIN_DIR = EXTJS_VIEW_DIR+"main/"
	static EXTJS_STORE_DIR = EXTJS_APP_DIR + "store/"
	static EXTJS_MODEL_DIR = EXTJS_APP_DIR + "model/"
	static EXTJS_CONTROLLER_DIR = EXTJS_APP_DIR + "controller/"
	static SCAFFOLDING_STATICS_DIR = "statics/"
	static SCAFFOLDING_STATICS_DIR_ANT_ALL = SCAFFOLDING_STATICS_DIR + "**/*.*"
	
	protected Template gridRenderEditorTemplate;
	protected Template detailViewRenderEditorTemplate;

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

	def renderEditor = { GrailsDomainClassProperty property, boolean isDetailView = false ->
		def domainClass = property.domainClass
		def cp
		boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
		if (hasHibernate) {
			cp = domainClass.constrainedProperties[property.name]
		}

		if (!gridRenderEditorTemplate) {
			// create template once for performance
			gridRenderEditorTemplate = engine.createTemplate(getTemplateText('gridEditor.template'))
		}
		if (!detailViewRenderEditorTemplate) {
			// create template once for performance
			detailViewRenderEditorTemplate = engine.createTemplate(getTemplateText('detailViewEditor.template'))
		}
		

		def binding = [
			pluginManager: pluginManager,
			property: property,
			domainClass: domainClass,
			cp: cp,
			domainInstance:getPropertyName(domainClass)]
		if(isDetailView) return detailViewRenderEditorTemplate.make(binding).toString()
		else return gridRenderEditorTemplate.make(binding).toString()
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

		Resource[] resources = []
		String templatesDirPath 
		if (resourceLoader != null && grailsApplication.isWarDeployed()) {
			templatesDirPath = "/WEB-INF/templates/scaffolding/"+SCAFFOLDING_STATICS_DIR
			try {
				PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver(resourceLoader);
				resources = resolver.getResources(templatesDirPath + SCAFFOLDING_STATICS_DIR_ANT_ALL)
			}catch (Exception e) {
				log.error("Error while loading views from " + templatesDirPath, e);
			}
		}else {
			PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();

			templatesDirPath = basedir + "/src/templates/scaffolding"+SCAFFOLDING_STATICS_DIR
			Resource templatesDir = new FileSystemResource(templatesDirPath + SCAFFOLDING_STATICS_DIR_ANT_ALL);
			if (templatesDir.exists()) {
				try {
					resources = resolver.getResources(templatesDirPath);
				}catch (Exception e) {
					log.error("Error while loading views from " + basedir, e);
				}
			}
			if(!resources) {
				File pluginDir = getPluginDir();
				try {
					templatesDirPath = pluginDir.path + "/src/templates/scaffolding/"
					resources = resolver.getResources("file:" + templatesDirPath + SCAFFOLDING_STATICS_DIR_ANT_ALL);
				} catch (Exception e) {
					// ignore
					log.error("Error locating templates from " + pluginDir + ": " + e.getMessage(), e);
				}
			}
		}


		for (Resource resource : resources) {
			Path dirPath = Paths.get(templatesDirPath);
			Path filePath = Paths.get(resource.file.path);
			Path relativeFilePath = dirPath.relativize(filePath);
			Path relativeFilePathWithoutStaticDir = relativeFilePath.subpath(1, relativeFilePath.nameCount)
		
			generateStatic(destDir, EXTJS_DIR + relativeFilePathWithoutStaticDir, resource)
		}

	}

	public void generateStatic(String destDir, String fileName, Resource templateFile) throws IOException {
		Assert.hasText(destDir, "Argument [destdir] not specified");

		File destFile = new File(destDir, fileName);
		if (canWrite(destFile)) {
			destFile.getParentFile().mkdirs();

			BufferedWriter writer = null;
			try {
				writer = new BufferedWriter(new FileWriter(destFile));
				generateStatic(writer, templateFile);
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

	protected void generateStatic(Writer out, Resource templateFile) throws IOException {
		String templateText = getTemplateTextFromResource(templateFile);

		Map<String, Object> binding = new HashMap<String, Object>();
		binding.put("appName", grailsApplication.metadata['app.name']);
		def domainClasses = grailsApplication.domainClasses
		binding.put("domainClasses", domainClasses);

		generate(templateText, binding, out);
	}
	
	protected String getTemplateTextFromResource(Resource templateFile) throws IOException {
		InputStream inputStream = templateFile.getInputStream();
		
		return inputStream == null ? null : IOGroovyMethods.getText(inputStream);
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