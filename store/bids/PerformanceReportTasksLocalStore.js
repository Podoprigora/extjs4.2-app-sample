Ext.define('App.store.bids.PerformanceReportTasksLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.PerformanceReportTaskModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});