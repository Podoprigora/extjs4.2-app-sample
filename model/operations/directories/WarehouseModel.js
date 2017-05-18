Ext.define('App.model.operations.directories.WarehouseModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields: [
        {
            name: "id",
            type: "int"
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
            name: "outer_id",
            type: "string"
        },
        {
            name: "city_id",
            type: "int"
        },
        {
            name: "address",
            type: "string"
        },
        {
            name: "area",
            type: "float",
            useNull: true
        },
        {
            name: "city",
            type: "auto",
            persist: false
        },
        {
            name: "region",
            type: "string",
            persist: false,
            convert: function (v, record) {
                if (Ext.isEmpty(record.get('city')) == false) {
                    return record.get('city').region;
                }
            }
        },
        {
            name: "full_name",
            type: "string",
            persist: false,
            convert: function (v, record) {
                return Ext.String.format("{0} - {1}", record.get("code"), record.get("name"));
            }
        },
        {
            name: "list_name",
            type: "string",
            persist: false,
            convert: function (v, record) {
                return Ext.String.format("{0} {1}", record.get("code"), record.get("address"));
            }
        },
        {
            name: "user",
            type: "auto",
            persist: false
        },
        {
            name: "user_full_name",
            type: "string",
            persist: false,
            convert: function (v, record) {
                if (Ext.isEmpty(record.get("user")) == false) {
                    var d = record.get("user").first_name,
                        e = record.get("user").last_name,
                        g = record.get("user").patronymic,
                        h = record.get("user").phone1,
                        a = Ext.String.format("{0} {1} {2}, {3}", e, d, g, h);
                    return a.replace(/\,\s+$/, "");
                }
                return v;
            }
        }
    ],
    
    validations: [{
        type: "presence",
        field: "city_id"
    }],
    
    hasOne: [{
        model: "App.model.settings.regions.CityModel",
        getterName: "getCity",
        associationKey: "city"
    }],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("directories.warehouses.save"),
            update: Settings.urls.getUrl("directories.warehouses.save"),
            destroy: Settings.urls.getUrl("directories.warehouses.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});