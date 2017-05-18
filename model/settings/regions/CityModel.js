Ext.define('App.model.settings.regions.CityModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
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
        name: "code",
        type: "string"
    },
    {
        name: "name",
        type: "string"
    },
    {
        name: "name_full",
        type: "string",
        persist: true,
        convert: function (b, a) {
            return Ext.String.format("{0}, {1}", a.get("name"), a.get("region"))
        }
    }],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("settings.regions.cities.save"),
            update: Settings.urls.getUrl("settings.regions.cities.save"),
            destroy: Settings.urls.getUrl("settings.regions.cities.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});