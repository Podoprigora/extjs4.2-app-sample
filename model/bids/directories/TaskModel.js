Ext.define('App.model.bids.directories.TaskModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'parent_id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'type', type : 'string'},
        {name : 'desc', type : 'string'},
        {name : 'type_id', type : 'int', useNull : true},
        {name : 'cat_or_zone_num', type : 'int'},
        {name : 'customer_price', type : 'float'},
        {name : 'performer_price', type : 'float'},
        {name : 'peoples_qty', type : 'int'},
        {name : 'minutes_qty', type : 'int'},
        {name : 'need_equipment', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'need_equipment_price', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'require_accounting_culc', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'visible_for_ordering', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'visible_for_performance', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'countable', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'is_hidden', type : 'int', convert : function(v){
            return (v == true || v == 1) ? 1 : 0;
        }},
        {name : 'priority', type : 'int'},
        {name : 'area_codes'},
        //{name: 'expanded', type: 'boolean', defaultValue: true, persist: false},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.directories.AreaCodeModel',
            name : 'getCodes',
            associationKey : 'area_codes'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.tasks.read'),
            create : Settings.urls.getUrl('bids.tasks.save'),
            update : Settings.urls.getUrl('bids.tasks.save'),
            destroy : Settings.urls.getUrl('bids.tasks.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});