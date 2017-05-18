Ext.define('App.model.settings.area_codes.CodeUserModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code_id', type : 'int'},
        {name : 'user_id', type : 'int'},
        {name : 'role_id', type : 'string'},
        {name : 'role', type : 'string'},
        {name : 'region', type : 'string'},
        {name : 'first_name', type : 'string'},
        {name : 'last_name', type : 'string'},
        {name : 'patronymic', type : 'string'},
        {name : 'fio', type : 'string', convert : function(v, record){
            return [record.get('last_name'),record.get('first_name'),record.get('patronymic')].join(" ");
        }},
        {name : 'removed', type : 'int'}
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