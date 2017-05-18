Ext.define('App.store.bids.BidCommentsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.BidCommentModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.comments.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});