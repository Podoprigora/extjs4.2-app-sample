Ext.define('App.store.bids.directories.SalesChannelsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.SalesChannelAssociationModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});