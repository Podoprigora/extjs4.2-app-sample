Ext.define('App.store.bids.directories.TasksLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.TaskAssociationModel',
    
    sorters : [
        {
            property : 'priority',
            direction : 'DESC'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});