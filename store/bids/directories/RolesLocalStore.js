Ext.define('App.store.bids.directories.RolesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.RoleModel',
    
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