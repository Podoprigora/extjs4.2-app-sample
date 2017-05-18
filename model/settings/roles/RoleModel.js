Ext.define('App.model.settings.roles.RoleModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'group', type : 'string'},
        {name : 'group_name', type : 'string', persist : false, convert : function(v, record){
            switch (record.get('group')) {
                case 'CS' : return 'Заказчик';
                case 'PR' : return 'Исполнитель';
                default : return 'Без группы';
            }
        }},
        {name : 'mobile_access', type : 'int', convert : function(v){
            return (v == true) ? 1 : 0;
        }},
        {name : 'is_hidden', type : 'int', convert : function(v){
            return (v == true) ? 1 : 0;
        }}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('settings.roles.read'),
            create : Settings.urls.getUrl('settings.roles.save'),
            update : Settings.urls.getUrl('settings.roles.save'),
            destroy : Settings.urls.getUrl('settings.roles.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});