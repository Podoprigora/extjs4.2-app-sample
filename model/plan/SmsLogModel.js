Ext.define('App.model.plan.SmsLogModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'phone', type : 'string'},
        {name : 'date', type : 'date', dateFormat:'Y-m-d H:i:s'},
        {name : 'groupdate', convert : function(v, record){
            return Ext.Date.format(record.get('date'), 'd.m.Y');
        }},
        {name : 'time', convert : function(v, record){
            return Ext.Date.format(record.get('date'), 'H:i:s');
        }},
        {name : 'shop_name', type : 'string'},
        {name : 'shop_address', type : 'string'},
        {name : 'message', type : 'string'},
        {name : 'type', type : 'string', convert : function(v){
            if (v && v.indexOf('gprs') > -1){
                return 'GPRS';
            } else {
                return 'SMS';
            }
        }},
        {name : 'is_low_balance', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});