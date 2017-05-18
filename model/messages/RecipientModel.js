Ext.define('App.model.messages.RecipientModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "first_name",
            type: "string"
        },
        {
            name: "last_name",
            type: "string"
        },
        {
            name: "patronymic",
            type: "string"
        },
        {
            name: "role_id",
            type: "int"
        },
        {
            name: "role",
            type: "string"
        },
        {
            name: "region",
            type: "string"
        },
        {
            name: "fio",
            type: "string",
            persist: false,
            convert: function (v, record) {
                return [record.get("last_name"), record.get("first_name"), record.get("patronymic")].join(" ").trim();
            }
        }
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});