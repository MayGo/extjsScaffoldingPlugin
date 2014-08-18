Ext.define('${appName}.store.MenuItems', {
	extend : 'Ext.data.Store',
	model : '${appName}.model.MenuItem',
	data : [	        
<%
for(d in domainClasses){%>
	{title: '${d.getShortName()}'},
<%}%>
	     ]
});