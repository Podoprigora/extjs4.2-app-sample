Ext.define('App.model.bids.BidTaskModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'task_id', type : 'id'},
        {name : 'name', type : 'string'},
        {name : 'type', type : 'string'},
        {name : 'description', type : 'string'},
        {name : 'price', type : 'float'},
        {name : 'qty', type : 'float'},
        {name : 'need_equipment', type : 'int'},
        {name : 'require_accounting_culc', type : 'int'},
        {name : 'countable', type : 'int'},
        {name : 'removed', type : 'int'}
    ],

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});