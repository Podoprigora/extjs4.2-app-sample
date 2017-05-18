Ext.define('App.store.plan.ScriptRuleTriggerTypesLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : [
        {name : 'type', type : 'string'},
        {name : 'name', type : 'string'}
    ],
    idProperty : 'type',
    
    data : [
        {
            type : 'D',
            name : 'Датчик'
        },
        {
            type : 'W',
            name : 'Пульт'
        },
        {
            type : 'P',
            name : 'Порт'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});