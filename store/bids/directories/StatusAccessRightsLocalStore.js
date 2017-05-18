Ext.define('App.store.bids.directories.StatusAccessRightsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.StatusAccessRightModel',

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});