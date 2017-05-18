Ext.define('App.model.bids.BidAgreementRouteModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'status_id', type : 'int'},
        {name : 'state', type : 'int'},
        {name : 'status_name', type : 'string'},
        {name : 'user_id', type : 'int'},
        {name : 'user', type : 'string'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'}
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