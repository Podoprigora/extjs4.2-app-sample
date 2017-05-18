Ext.define('App.store.bids.UpdatesLogStore', {
    extend : 'Ext.data.Store',
    model: "App.model.bids.UpdateLogModel",
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    
    remoteSort: true,
    remoteFilter: true,
    
    groupField: "group",
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("bids.updates_log.list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});