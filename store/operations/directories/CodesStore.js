Ext.define('App.store.operations.directories.CodesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.directories.CodeModel',
    storeId : 'DirectoryCodesStore',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('directories.codes.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});