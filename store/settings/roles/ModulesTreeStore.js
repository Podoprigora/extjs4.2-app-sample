Ext.define('App.store.settings.roles.ModulesTreeStore', {
    extend : 'Ext.data.TreeStore',
    model : 'App.model.settings.roles.ModuleModel',
    
    autoLoad : false,
    
    root : {
        name : 'root',
        title : 'Подключаемые модули',
        expanded : false
    },
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('settings.roles.modules.tree'),
            update : Settings.urls.getUrl('settings.roles.modules.save')
        },
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json',
            root : 'records'
        }
    }
    
});