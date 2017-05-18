Ext.define('App.store.bids.BidMaterialsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.BidMaterialModel',
    
    groupField : 'task_name',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});