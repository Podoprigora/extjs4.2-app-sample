Ext.define('App.store.bids.directories.SalesChannelsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.SalesChannelModel',
    
    autoLoad : false,
    buffered : false,
    
    pageSize : 250,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.sales_channels.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});