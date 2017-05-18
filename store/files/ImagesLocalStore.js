Ext.define('App.store.files.ImagesLocalStore', {
    extend : 'Ext.data.Store',
    model: "App.model.files.ImageModel",
    
    autoLoad: false,
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});