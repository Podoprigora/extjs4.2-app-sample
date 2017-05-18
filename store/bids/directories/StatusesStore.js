Ext.define('App.store.bids.directories.StatusesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.directories.StatusModel',
    
    autoLoad : false,
    
    pageSize : 100,
    
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
        url : Settings.urls.getUrl('bids.statuses.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});