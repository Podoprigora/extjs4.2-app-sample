Ext.define('App.store.catalog.MaterialCodesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.catalog.MaterialCodeModel',
    
    autoLoad : false,
    remoteFilter : true,
    
    groupField : 'kit',
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('catalog.materials.codes.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});