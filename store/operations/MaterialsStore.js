Ext.define('App.store.operations.MaterialsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.MaterialModel',
    
    autoLoad : false,
    
    pageSize : 250,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('operations.materials.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});