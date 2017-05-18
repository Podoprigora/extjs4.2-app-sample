Ext.define('App.store.operations.directories.WarehousesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.directories.WarehouseModel',
    storeId: "DirectoryWarehousesStore",
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    remoteSort: true,
    remoteFilter: true,
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("directories.warehouses.list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});