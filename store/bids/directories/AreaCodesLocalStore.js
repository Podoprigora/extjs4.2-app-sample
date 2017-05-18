Ext.define('App.store.bids.directories.AreaCodesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.AreaCodeModel',
    
    sorters : [{
        property : 'code',
        direction : 'ASC'
    }],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});