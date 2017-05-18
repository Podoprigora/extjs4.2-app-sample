Ext.define('App.store.bids.directories.TasksTreeStore', {
    extend : 'Ext.data.TreeStore',
    model : 'App.model.bids.directories.TaskModel',
    
    autoLoad : false,
    remoteSort : true,
    
    root : {
        id : 0,
        name : 'Все задачи',
        expanded : false
    },
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.tasks.list'),
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json',
            totalProperty : 'count',
            root : 'records'
        }
    }
    
});