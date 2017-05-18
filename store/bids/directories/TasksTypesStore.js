Ext.define('App.store.bids.directories.TasksTypesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.TasksTypeModel',
    
    autoLoad : false,
    buffered : false,
    
    pageSize : 250,
    
    remoteSort : true,
    remoteFilter : true,
    
    sorters : [
        {
            property : 'position',
            direction : 'ASC'
        }
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('bids.tasks_types.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});