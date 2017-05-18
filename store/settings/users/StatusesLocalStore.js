Ext.define('App.store.settings.users.StatusesLocalStore', {
    extend : 'Ext.data.Store',
    
    fields: ["id", "name", "color"],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        },
        data: [
            {
                id: 2,
                name: "Ожидает активации",
                color : "#FFECB3"
            },
            {
                id: 1,
                name: "Активирован",
                color : "#C8E6C9"
            },
            {
                id: 0,
                name: "Заблокирован",
                color : "#FFCDD2"
            }
        ]
    }
    
});