Ext.define('App.store.operations.AvailableMaterialsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.AvailableMaterialModel',
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    remoteSort: true,
    remoteFilter: true,
    
    proxy: {
        type: "ajax",
        extraParams: {
            available: true
        },
        url: Settings.urls.getUrl("operations.materials.available_list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});