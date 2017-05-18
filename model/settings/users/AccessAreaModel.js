Ext.define('App.model.settings.users.AccessAreaModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "user_id",
            type: "int"
        },
        {
            name: "region_id",
            type: "int"
        },
        {
            name: "region",
            type: "string",
            persist : false
        },
        {
            name: "city_id",
            type: "int"
        },
        {
            name: "city",
            type: "string",
            persist : false
        },
        {
            name: "warehouse_id",
            type: "int"
        },
        {
            name: "warehouse",
            type: "string",
            persist : false
        },
        {
            name : 'removed',
            type : 'int'
        }
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});