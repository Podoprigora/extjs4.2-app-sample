Ext.define('App.store.operations.OperationsReportStore', {
    extend : 'Ext.data.Store',
    model: "App.model.operations.OperationsReportModel",
    
    autoLoad: false,
    buffered: true,
    pageSize: 80,
    leadingBufferZone: 25,
    
    remoteSort: true,
    remoteFilter: true,
    remoteGroup: false,
    
    groupField: "operation_full_name",
    groupDir: "DESC",
    
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