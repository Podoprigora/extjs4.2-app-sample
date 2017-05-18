Ext.define('App.model.files.FileModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'client_name', type : 'string'},
        {name : 'server_name', type : 'string'},
        {name : 'removed', type : 'int', defaultValue : 0}
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