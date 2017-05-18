Ext.define('App.model.settings.roles.ModuleModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'name',
    
    fields : [
        {name : 'name', type : 'string'},
        {name : 'role_id', type : 'int'},
        {name : 'title', type : 'string'},
        {name : 'access', type : 'string', useNull : true},
        {name : 'active_menu', type : 'int', convert : function(v){
            return (parseInt(v) == 1 || v == true) ? 1 : 0;   
        }}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            update : Settings.urls.getUrl('settings.roles.modules.save')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});