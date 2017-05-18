Ext.define('App.store.bids.BidsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.BidModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.list'),
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});