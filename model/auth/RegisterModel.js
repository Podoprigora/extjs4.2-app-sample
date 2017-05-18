Ext.define('App.model.auth.RegisterModel', {
    extend : 'Ext.data.Model',
    
    fields : [
        {name : 'fio', type : 'string'},
        {name : 'role_id', type : 'int'},
        {name : 'login', type : 'string'},
        {name : 'password', type : 'string'},
        {name : 'password_confirm', type : 'string'},
        {name : 'phone', type : 'string'},
        {name : 'area_code', type : 'string'},
        {name : 'area_code_id', type : 'int'},
        {name : 'region', type : 'string'},
        {name : 'region_id', type : 'int'},
        {name : 'city', type : 'string'},
        {name : 'city_id', type : 'int'},
        {name : 'warehouse', type : 'string'},
        {name : 'warehouse_id', type : 'int'}
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('account.register'),
        reader : {
            type :'json'
        },
        writer : {
            type : 'json'
        }
    }
});