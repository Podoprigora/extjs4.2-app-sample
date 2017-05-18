Ext.define('App.model.operations.OperationModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "code",
        type: "string"
    },
    {
        name: "date",
        type: "date",
        dateFormat: "Y-m-d H:i:s"
    },
    {
        name: "time",
        type: "date",
        dateFormat: "H:i:s",
        persist: false
    },
    {
        name: "type",
        type: "string"
    },
    {
        name : 'confirm_invalid_remain',
        type : 'int',
        defaultValue : 0
    },
    {
        name: "document",
        type: "string"
    },
    {
        name: "user",
        type: "string"
    },
    {
        name: "warehouse_id",
        type: "int"
    },
    {
        name: "transit_warehouse_id",
        type: "int"
    },
    {
        name: "materials",
        type: "auto"
    },
    {
        name: "files",
        type: "auto"
    },
    {
        name : 'comments',
        type : 'string'
    },
    {
        name: "warehouse",
        type: "auto",
        persist: false
    },
    {
        name: "transit_warehouse",
        type: "auto",
        persist: false
    },
    {
        name: "warehouse_user",
        type: "auto",
        persist: false
    },
    {
        name: "transit_warehouse_user",
        type: "auto",
        persist: false
    },
    {
        name: "warehouse_full_name",
        type: "string",
        persist: false,
        convert: function (value, record) {
            var warehouse = record.get("warehouse");
            if (Ext.isEmpty(warehouse) == false) {
                var result = Ext.String.format("{0} - {1}, {2}", warehouse.code, warehouse.name, warehouse.address);
                return result.replace(/\,\s+$/, "");
            }
            return value;
        }
    },
    {
        name: "transit_warehouse_full_name",
        type: "string",
        persist: false,
        convert: function (value, record) {
            var warehouse = record.get("transit_warehouse");
            if (Ext.isEmpty(warehouse) == false) {
                var result = Ext.String.format("{0} - {1}, {2}", warehouse.code, warehouse.name, warehouse.address);
                return result.replace(/\,\s+$/, "");
            }
            return value;
        }
    },
    {
        name: "warehouse_user_full_name",
        type: "string",
        persist: false,
        convert: function (value, record) {
            var user = record.get("warehouse_user");
            if (Ext.isEmpty(user) == false) {
                var result = Ext.String.format(
                    "{0} {1} {2}, {3}", 
                    Ext.valueFrom(user.first_name, ""), Ext.valueFrom(user.last_name, ""), Ext.valueFrom(user.patronymic, ""), Ext.valueFrom(user.phone1, ""));
                return result.replace(/\,\s+$/, "");
            }
            return value;
        }
    },
    {
        name: "transit_warehouse_user_full_name",
        type: "string",
        persist: false,
        convert: function (value, record) {
            var user = record.get("transit_warehouse_user");
            if (Ext.isEmpty(user) == false) {
                var result = Ext.String.format(
                    "{0} {1} {2}, {3}", 
                    Ext.valueFrom(user.first_name, ""), Ext.valueFrom(user.last_name, ""), Ext.valueFrom(user.patronymic, ""), Ext.valueFrom(user.phone1, ""));
                return result.replace(/\,\s+$/, "");
            }
            return value;
        }
    }],
    
    hasMany: [{
        model: "App.model.operations.MaterialModel",
        name: "getMaterials",
        associationKey: "materials"
    },
    {
        model: "App.model.files.FileModel",
        name: "getFiles",
        associationKey: "files"
    }],
    
    hasOne: [{
        model: "App.model,operations.directories.WarehouseModel",
        associationKey: "warehouse",
        getterName: "getWarehouse"
    },
    {
        model: "App.model.settings.users.UserModel",
        associationKey: "user",
        getterName: "getUser"
    }],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("operations.save"),
            read: Settings.urls.getUrl("operations.read"),
            update: Settings.urls.getUrl("operations.save"),
            destroy: Settings.urls.getUrl("operations.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});