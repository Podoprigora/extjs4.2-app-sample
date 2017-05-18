Ext.define('App.store.operations.TypesLocalStore', {
    extend : 'Ext.data.TreeStore',
    
    fields: [
        "id", "name", "color",
        {
            name: "checked",
            type: "boolean",
            defaultValue: false
        }
    ],
    
    root: {
        id: -1,
        expanded: true
    },
    
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