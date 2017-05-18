Ext.define('App.store.main.CatalogLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.main.CatalogModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});