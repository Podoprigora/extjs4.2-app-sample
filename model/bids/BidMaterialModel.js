Ext.define('App.model.bids.BidMaterialModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'task_id', type : 'id'},
        {name : 'material_id', type : 'id'},
        {name : 'name', type : 'string'},
        {name : 'task_name', type : 'string'},
        {name : 'price', type : 'float'},
        {name : 'qty', type : 'float'},
        {name : 'removed', type : 'int'}
    ],

    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    },
    
    set : function(field, value) {
        this.callParent(arguments);
        
        if (field == 'qty') {
            this.set('amount', value * this.get('price'));
        }
    }
    
});