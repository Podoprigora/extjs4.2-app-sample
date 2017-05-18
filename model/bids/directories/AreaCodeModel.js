Ext.define('App.model.bids.directories.AreaCodeModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code_id', type : 'int'},
        {name : 'code', type : 'int'},
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