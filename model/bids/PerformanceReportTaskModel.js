Ext.define('App.model.bids.PerformanceReportTaskModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'task_id', type : 'int'},
        {name : 'task', type : 'string'},
        {name : 'countable_task', type : 'int'},
        {name : 'culc_type', type : 'string'},
        {name : 'user_id', type : 'int'},
        {name : 'user', type : 'string'},
        {name : 'user_role', type : 'string'},
        {name : 'qty', type : 'float'},
        {name : 'price', type : 'float'},
        {name : 'minutes', type : 'float'},
        {name : 'completed', type : 'int', convert : function(v){
            return (v == 1 || v === true) ? 1 : 0;
        }},
        {name : 'materials', type : 'auto', persist : false},
        {name : 'removed', type : 'int'}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.BidMaterialModel',
            associationKey : 'materials',
            name : 'getMaterials'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});