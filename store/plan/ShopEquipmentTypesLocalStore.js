Ext.define('App.store.plan.ShopEquipmentTypesLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : ['id', 'name'],
    
    data : [
        {
            id : 1,
            name : 'Тип 1'
        },
        {
            id : 2,
            name : 'Тип 2'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});