Ext.define('App.store.plan.ShopPlanogramsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ShopPlanogramModel',
    
    autoLoad : false,
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});