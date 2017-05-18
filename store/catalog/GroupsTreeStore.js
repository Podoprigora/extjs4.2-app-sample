Ext.define('App.store.catalog.GroupsTreeStore', {
    extend : 'Ext.data.TreeStore',
    model : 'App.model.catalog.GroupModel',
    
    autoLoad : false,
    
    root : {
        id : 0,
        name : 'Все категории',
        expanded : false
    },
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('catalog.groups.tree'),
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json',
            root : 'records'
        }
    }
    
});