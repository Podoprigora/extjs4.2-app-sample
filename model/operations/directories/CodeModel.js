Ext.define('App.model.operations.directories.CodeModel', {
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
        name: "description",
        type: "string"
    }],
    
    proxy: {
        type: "ajax",
        api: {
            create: Settings.urls.getUrl("directories.codes.save"),
            update: Settings.urls.getUrl("directories.codes.save"),
            destroy: Settings.urls.getUrl("directories.codes.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
});