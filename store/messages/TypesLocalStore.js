Ext.define('App.store.messages.TypesLocalStore', {
    extend : 'Ext.data.TreeStore',
    
    fields : [
        'id', 'name',
        {name : 'checked', type : 'boolean', defaultValue : false}
    ],
    
    root : {
        id : -1,
        expanded : true
    },
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        },
        data : [
            {
                id : 'incoming',
                name : 'Входящие'
            },
            {
                id : 'outcoming',
                name : 'Отправленные'
            },
            {
                id : 'unread',
                name : 'Не прочитанные'
            }
        ]
    }
    
});