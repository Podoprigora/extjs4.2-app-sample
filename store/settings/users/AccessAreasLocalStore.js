Ext.define('App.store.settings.users.AccessAreasLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.users.AccessAreaModel',
    
    autoLoad : false,
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});