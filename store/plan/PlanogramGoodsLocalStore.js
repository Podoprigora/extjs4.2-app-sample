
Ext.define('App.store.plan.PlanogramGoodsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.PlanogramGoodsModel',
    
    autoLoad : false,
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});