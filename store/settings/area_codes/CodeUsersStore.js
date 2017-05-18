Ext.define('App.store.settings.area_codes.CodeUsersStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.area_codes.CodeUserModel',
    
    proxy : {
        type : 'ajax',
        api : {
            update : Settings.urls.getUrl('settings.area_codes.users.save'),
            destroy : Settings.urls.getUrl('settings.area_codes.users.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});