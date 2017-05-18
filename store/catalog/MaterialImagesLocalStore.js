Ext.define('App.store.catalog.MaterialImagesLocalStore', {
    extend : 'Ext.data.Store',
    model: "App.model.catalog.MaterialImageModel",
    
    autoLoad: false,
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});