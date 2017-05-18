Ext.define('App.model.settings.users.AvailableWarehouseModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'city_id', type : 'int'},
        {name : 'region_id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'city', type : 'string'},
        {name : 'region', type : 'string'},
        {name : 'address', type : 'string', convert : function(v, record){
            return [record.get('city'), record.get('region'), v].join(", ").replace(/,\s$/, "");
        }}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});