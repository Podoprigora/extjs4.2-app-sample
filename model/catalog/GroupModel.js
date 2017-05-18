Ext.define('App.model.catalog.GroupModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "name",
            type: "string"
        },
        {
            name: "removed",
            type: "int"
        }
    ],
    
    validations: [
        {
            field: "name",
            type: "presence"
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("catalog.groups.save"),
            update: Settings.urls.getUrl("catalog.groups.save"),
            destroy: Settings.urls.getUrl("catalog.groups.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
});