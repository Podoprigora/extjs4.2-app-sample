Ext.define('App.store.operations.UpdatesLogsStore', {
    extend : 'Ext.data.Store',
    model: "App.model.operations.UpdateLogsModel",
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    
    remoteSort: true,
    remoteFilter: true,
    
    groupField: "operation",
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("operations.update_logs.list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});