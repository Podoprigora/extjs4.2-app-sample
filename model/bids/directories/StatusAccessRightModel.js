Ext.define('App.model.bids.directories.StatusAccessRightModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'right_name',
    
    fields : [
        {name : 'status_id', type : 'int'},
        {name : 'right_name', type : 'string'},
        {name : 'is_allowed', type : 'int', convert : function(v){
            return (parseInt(v) == 1 || v == true) ? 1 : 0;
        }}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});