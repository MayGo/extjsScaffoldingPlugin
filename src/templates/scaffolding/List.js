<% 
	import grails.persistence.Event
	import org.codehaus.groovy.grails.commons.DomainClassArtefactHandler
%>

Ext.define('${appName}.view.${domainClass.propertyName}.List', {
	extend : 'Ext.grid.Panel',
	requires : 'Ext.grid.filters.Filters',
	xtype : '${domainClass.propertyName}list-grid',
	store : '${className}List',
	columnLines : true,
	height : 400,
	width : 910,
	title : '${className}',
	multiColumnSort : true,
	multiSelect: true,
	requires : ['${appName}.view.${domainClass.propertyName}.ListController'],

	controller : '${domainClass.propertyName}list',
	selModel : { 
		pruneRemoved: false,
		listeners : {
			selectionchange : 'onSelectionChangeListener'
		}
	},
	
	

	columns : [
	{
		xtype : 'rownumberer',
		width : 40,
		sortable : false
	}, {
		text : 'ID',
		width : 50,
		sortable : true,
		dataIndex : 'id',
		renderer : function(v, meta, rec) {
			return rec.phantom ? '' : v;
		}
	},
	
<%  excludedProps = Event.allEvents.toList() << 'version' << 'dateCreated' << 'lastUpdated'
	persistentPropNames = domainClass.persistentProperties*.name
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	if (hasHibernate) {
		def GrailsDomainBinder = getClass().classLoader.loadClass('org.codehaus.groovy.grails.orm.hibernate.cfg.GrailsDomainBinder')
		if (GrailsDomainBinder.newInstance().getMapping(domainClass)?.identity?.generator == 'assigned') {
			persistentPropNames << domainClass.identifier.name
		}
	}
	props = domainClass.properties.findAll { persistentPropNames.contains(it.name) && !excludedProps.contains(it.name) && (domainClass.constrainedProperties[it.name] ? domainClass.constrainedProperties[it.name].display : true) }
	Collections.sort(props, comparator.constructors[0].newInstance([domainClass] as Object[]))
	for (p in props) {
		if (p.embedded) {
			def embeddedPropNames = p.component.persistentProperties*.name
			def embeddedProps = p.component.properties.findAll { embeddedPropNames.contains(it.name) && !excludedProps.contains(it.name) }
			Collections.sort(embeddedProps, comparator.constructors[0].newInstance([p.component] as Object[]))
			//NOT USED
		} else {
			renderFieldForProperty(p, domainClass)
		}
	}

private renderFieldForProperty(p, owningClass, prefix = "") {
	boolean hasHibernate = pluginManager?.hasGrailsPlugin('hibernate') || pluginManager?.hasGrailsPlugin('hibernate4')
	boolean required = false
	if (hasHibernate) {
		cp = owningClass.constrainedProperties[p.name]
		required = (cp ? !(cp.propertyType in [boolean, Boolean]) && !cp.nullable : false)
	}
	%>
	{
		text : '${p.naturalName}',
		sortable : true,
		dataIndex : '${p.name}',
		groupable : true,
		flex: 1,
		${renderEditor(p)}
		
	},
<%  } %>
],
	dockedItems : [{
		dock: 'top',
		xtype : 'toolbar',
		items : [{
                width: 400,
                fieldLabel: 'Search',
                labelWidth: 50,
                xtype: 'searchfield',
                store: '${className}List'
            }, '->', {
                xtype: 'component',
                itemId: 'status',
                tpl: 'Matching threads: {count}',
                style: 'margin-right:5px'
            },{
    			text : 'Add',
    			iconCls : 'icon-add',
    			handler : 'addItemHandler'
    		}, '-', {
    			itemId : 'delete',
    			text : 'Delete',
    			iconCls : 'icon-delete',
    			disabled : true,
    			handler : 'deleteItemHandler'
    		}
		]
	},
	{
        xtype: 'pagingtoolbar',
        store: '${className}List',   // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }],
	viewConfig : {
		stripeRows : true
	},
	plugins : [{
		ptype : 'rowediting',
		pluginId : 'rowediting'
	}]
});
