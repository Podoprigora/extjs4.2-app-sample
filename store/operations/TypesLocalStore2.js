Ext.define('App.store.operations.TypesLocalStore2', {
    extend : 'Ext.data.Store',
    
    fields: ["id", "name"],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        },
        data: [
            {
                id: "incoming",
                name: "Приход"
            },
            {
                id: "incoming-transit",
                name: "Принято из транзита"
            },
            {
                id: "issue",
                name: "Выдача"
            },
            {
                id: "issue-transit",
                name: "Выпущено в транзит"
            },
            {
                id: "return",
                name: "Возврат"
            },
            {
                id: "cancel",
                name: "Списание"
            }
        ]
    }
    
});