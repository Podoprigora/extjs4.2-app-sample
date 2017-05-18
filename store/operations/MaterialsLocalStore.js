Ext.define('App.store.operations.MaterialsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.MaterialModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});