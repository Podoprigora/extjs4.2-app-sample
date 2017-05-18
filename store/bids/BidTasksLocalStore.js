Ext.define('App.store.bids.BidTasksLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.BidTaskModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});