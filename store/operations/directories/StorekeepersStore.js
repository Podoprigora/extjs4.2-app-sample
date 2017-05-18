Ext.define('App.store.operations.directories.StorekeepersStore', {
    extend : 'Ext.data.Store',
    model: "App.model.operations.directories.StorekeeperModel",
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    remoteSort: true,
    remoteFilter: true,
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("directories.storekeepers.list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});