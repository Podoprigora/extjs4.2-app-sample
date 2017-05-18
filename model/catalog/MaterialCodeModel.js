Ext.define('App.model.catalog.MaterialCodeModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'kit', type : 'int', defautValue : 1},
        {name : 'code_id', type : 'int'},
        {name : 'material_id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'name', type : 'string'},
        {name : 'removed', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});