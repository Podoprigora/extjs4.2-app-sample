Ext.define('App.model.operations.RemainsReportModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'w_code', type : 'string'},
        {name : 'w_city', type : 'string'},
        {name : 'w_region', type : 'string'},
        {name : 'w_name', type : 'string'},
        {name : 'w_address', type : 'string'},
        {name : 'u_first_name', type : 'string'},
        {name : 'u_last_name', type : 'string'},
        {name : 'u_patronymic', type : 'string'},
        {name : 'name', type : 'string'},
        {name : 'batch', type : 'string'},
        {name : 'available_qty', type : 'float'},
        {name : 'price', type : 'float'},
        {name : 'user', type : 'string', persist : false, convert : function(v, record){
            var fn = record.get('u_first_name'),
                ln = record.get('u_last_name'),
                p = record.get('u_patronymic'),
                result = Ext.String.format("{0} {1}. {2}.", ln, fn.substr(0, 1), p.substr(0, 1));
            return result.replace(/\.\s\.$/, ".");
        }},
        {name : 'warehouse', type : 'string', convert : function(v, record) {
            var result = Ext.String.format("{0} - {1}, {2}", record.get('w_code'), record.get('w_name'));
            return result.replace(/\,\s+$/, "");
        }}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});