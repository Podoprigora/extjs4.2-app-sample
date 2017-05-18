Ext.define('App.store.bids.TypesLocalStore', {
    extend : 'Ext.data.Store',
    
    fields : ['id', 'name'],
    
    data : [
        {
            id : 'pending',
            name : 'Ожидающие'
        },
        {
            id : 'my',
            name : 'Собственные'
        },
        {
            id : 'reject',
            name : 'Отклоненные'
        },
        {
            id : 'completed',
            name : 'Табель (Выполненные)'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});