Ext.define('App.model.catalog.MaterialFileModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'file', type : 'string'},
        {name : 'type', type : 'string'},
        {name : 'description', type : 'string'},
        {name : 'created', type : 'date', dateFormat : 'Y-m-d H:i:s'},
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