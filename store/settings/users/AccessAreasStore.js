Ext.define('App.store.settings.users.AccessAreasStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.users.AccessAreaModel',
    
    autoLoad : false,
    
    pageSize : 100,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.users.access_areas.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});