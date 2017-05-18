
Ext.define('App.store.operations.directories.MaterialsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.directories.MaterialModel',
    storeId : 'DirectoryMaterialsStore',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('directories.materials.list'),
        simpleSortMode : true,  
        reader : {
            type : 'json'
        }
    }
    
});