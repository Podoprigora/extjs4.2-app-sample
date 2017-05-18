Ext.define('App.model.bids.directories.TaskAssociationModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'task_id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'priority', type : 'int'},
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