Ext.define('App.model.bids.directories.StatusAssociationModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'status_id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'position', type : 'int'},
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