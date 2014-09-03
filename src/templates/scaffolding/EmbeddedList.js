
Ext.define('${appName}.view.${domainClass.propertyName}.EmbeddedList', {
	extend : '${appName}.view.${domainClass.propertyName}.List',
	xtype : '${domainClass.propertyName.toLowerCase()}-embedded-gridlist',
	loadOnInit: false,
	setStore: function (store) {
		var objArr = store;

		//make copy of global store
		var newStore = Ext.create(Ext.ClassManager.getName(this.store));
		
		//Load full object from store using objects id
		if(objArr){
			Ext.each(objArr, function(record) {
				newStore.load({id:record['id'],  addRecords: true})
			}, this);
		}
		this.reconfigure(newStore);
	}
});
