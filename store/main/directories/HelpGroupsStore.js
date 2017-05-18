Ext.define('App.store.main.directories.HelpGroupsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.main.directories.HelpGroupModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('main.directories.help_groups.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});