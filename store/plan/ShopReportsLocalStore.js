Ext.define('App.store.plan.ShopReportsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ShopReportModel',
    
    sorters : [
        {
            property : 'created',
            direction : 'DESC'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});