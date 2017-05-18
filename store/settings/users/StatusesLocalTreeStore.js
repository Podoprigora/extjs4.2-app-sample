Ext.define('App.store.settings.users.StatusesLocalTreeStore', {
    extend : 'Ext.data.TreeStore',
    
    fields: [
        "id", "name",
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
                id: 2,
                name: "Ожидает активации"
            },
            {
                id: 1,
                name: "Активирован"
            },
            {
                id: 0,
                name: "Заблокирован"
            }
        ]
    }
    
});