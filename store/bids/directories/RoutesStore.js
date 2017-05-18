Ext.define('App.store.bids.directories.RoutesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.RouteModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    sorters : [
        {
            property : 'priority',
            direction : 'DESC'
        }
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.routing.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});