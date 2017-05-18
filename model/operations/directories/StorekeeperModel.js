Ext.define('App.model.operations.directories.StorekeeperModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "region_id",
        type: "int"
    },
    {
        name: "region",
        type: "string"
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
        name: "fio",
        type: "string",
        persist: false,
        convert: function (b, a) {
            return [a.get("last_name"), a.get("first_name"), a.get("patronymic")].join(" ").trim()
        }
    },
    {
        name: "group",
        type: "string"
    },
    {
        name: "outer_id",
        type: "string"
    },
    {
        name: "phone1",
        type: "string"
    },
    {
        name: "phone2",
        type: "string"
    },
    {
        name: "phones",
        type: "string",
        persist: false,
        convert: function (b, a) {
            var c = new Array();
            if (Ext.isEmpty(a.get("phone1")) == false) {
                c.push(a.get("phone1"))
            }
            if (Ext.isEmpty(a.get("phone2")) == false) {
                c.push(a.get("phone2"))
            }
            return c.join(", ")
        }
    },
    {
        name: "email",
        type: "string"
    },
    {
        name: "pass_code",
        type: "string"
    },
    {
        name: "pass_series",
        type: "string"
    },
    {
        name: "pass_date",
        type: "date",
        dateFormat: "Y-m-d"
    },
    {
        name: "address",
        type: "string"
    },
    {
        name: "is_active",
        type: "int",
        defaultValue: 1
    },
    {
        name: "warehouses",
        type: "auto"
    },
    {
        name: "warehouses_list",
        type: "string",
        persist: false,
        convert: function (b, a) {
            if (Ext.isEmpty(a.get("warehouses")) == false && a.get("warehouses").length) {
                var c = [];
                Ext.Array.forEach(a.get("warehouses"), function (d) {
                    var e = Ext.String.format("{0} - {1}", d.code, d.name);
                    c.push(e.replace(/,.$/, ""));
                });
                return c.join(", ");
            }
        }
    }],
    
    hasMany: [{
        model: "App.model.operations.directories.WarehouseModel",
        name: "getWarehouses",
        associationKey: "warehouses"
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});