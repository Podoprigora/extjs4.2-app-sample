Ext.define('App.store.catalog.MaterialFilesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.catalog.MaterialFileModel',
    
    sorters : [
        {property : 'created', direction : 'ASC'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});