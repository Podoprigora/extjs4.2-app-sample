Ext.define('App.model.operations.MaterialModel', {
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
        type: "int",
        useNull: true
    },
    {
        name: "return_code_id",
        type: "int",
        useNull: true
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
        name: "qty",
        type: "float",
        convert: function (value) {
            return Math.abs(value);
        }
    },
    {
        name: "available_qty",
        type: "float",
        persist: false
    },
    {
        name: "amount",
        type: "float",
        persist: false,
        convert: function (value, record) {
            return record.culcAmount();
        }
    },
    {
        name: "removed",
        type: "int"
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    },
    
    set: function (field, value) {
        this.callParent(arguments);
        
        if (field == "qty" || field == "price") {
            this.set("amount", this.culcAmount());
        }
    },
    
    culcAmount: function () {
        return this.get("qty") * this.get("price");
    }
    
});