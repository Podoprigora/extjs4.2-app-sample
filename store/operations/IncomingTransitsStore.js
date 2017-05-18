Ext.define('App.store.operations.IncomingTransitsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.operations.IncomingTransitModel',
    
    autoLoad: false,
    buffered: true,
    pageSize: 60,
    leadingBufferZone: 20,
    remoteSort: true,
    remoteFilter: true,
    remoteGroup: false,
    
    groupField: "operation_full_name",
    groupDir: "DESC",
    
    filters: [{
        property: "incoming_transit",
        value: true
    }],
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("operations.reports.operations_list"),
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});