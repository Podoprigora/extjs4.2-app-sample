Ext.define('App.model.bids.directories.RoleModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'role_id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'removed', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});