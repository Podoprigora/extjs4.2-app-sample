Ext.define('App.store.bids.directories.StatusesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.StatusAssociationModel',
    
    sorters : [
        {
            property : 'position',
            direction : 'ASC'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});