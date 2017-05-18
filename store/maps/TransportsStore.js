Ext.define('App.store.maps.TransportsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.maps.TransportModel',
    
    autoLoad : false,
    
    pageSize : 500,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('maps.transports.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});