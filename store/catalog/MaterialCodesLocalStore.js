Ext.define('App.store.catalog.MaterialCodesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.catalog.MaterialCodeModel',
    
    autoLoad : false,
    
    groupField : 'kit',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});