Ext.define('App.store.plan.ShopEquipmentReportPeriodsLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : ['id', 'name'],
    
    data : [
        {
            id : 1,
            name : 'Ежечасно'
        },
        {
            id : 2,
            name : 'Ежедневно'
        },
        {
            id : 0,
            name : 'По запросу'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});