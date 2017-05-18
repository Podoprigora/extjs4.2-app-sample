Ext.define('App.store.plan.ShopEquipmentModeLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : ['id', 'name'],
    
    data : [
        {
            id : 2,
            name : 'SMS'
        },
        {
            id : 1,
            name : 'GPRS'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});