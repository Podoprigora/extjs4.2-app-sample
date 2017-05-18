Ext.define('App.store.files.FilesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.files.FileModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});