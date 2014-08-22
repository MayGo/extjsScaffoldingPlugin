Ext.override(Ext.data.proxy.Rest, {
    setException: function(operation, response){
        console.log("REST Exception");
		
        operation.response = response;
        operation.responseText = response.responseText;
        operation.responseData = Ext.JSON.decode(operation.responseText); 
		operation.setException({
            status: response.status,
            statusText: response.statusText
        });
    }
});