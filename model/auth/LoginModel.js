Ext.define('App.model.auth.LoginModel', {
    extend : 'Ext.data.Model',
    
    fields : [
        {name : 'auth_login', type : 'string'},
        {name : 'auth_password', type : 'string'},
        {name : 'remember_me', type : 'int'}
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('account.login'),
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
});