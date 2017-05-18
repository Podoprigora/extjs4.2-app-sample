Ext.define('App.store.settings.roles.RolesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.roles.RoleModel',
    
    autoLoad : false,
    //buffered : true,
    
    pageSize : 250,
    //leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    groupField : 'group_name',
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.roles.list'),
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});