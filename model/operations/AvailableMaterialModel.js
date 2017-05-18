Ext.define('App.model.operations.AvailableMaterialModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "material_id",
        type: "int"
    },
    {
        name: "code_id",
        type: "int"
    },
    {
        name: "batch",
        type: "string"
    },
    {
        name: "code",
        type: "string"
    },
    {
        name: "name",
        type: "string"
    },
    {
        name: "unit",
        type: "string",
        defaultValue: "шт."
    },
    {
        name: "price",
        type: "float"
    },
    {
        name: "warehouse_id",
        type: "int"
    },
    {
        name: "available_qty",
        type: "float"
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});