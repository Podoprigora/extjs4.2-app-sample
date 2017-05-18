Ext.define('App.model.settings.regions.RegionModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "time_zone_id",
            type: "string"
        },
        {
            name : 'is_server_time_zone',
            type : 'int',
            defaultValue : 0
        },
        {
            name: "name",
            type: "string"
        },
        {
            name : "cover_image",
            type : 'string'
        },
        {
            name: "customer_legal_name",
            type: "string"
        },
        {
            name: "performer_legal_name",
            type: "string"
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("settings.regions.save"),
            update: Settings.urls.getUrl("settings.regions.save"),
            read: Settings.urls.getUrl("settings.regions.read"),
            destroy: Settings.urls.getUrl("settings.regions.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});