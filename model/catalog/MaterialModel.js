Ext.define('App.model.catalog.MaterialModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {name: "id", type: "int" },
        {name: "group_id",type: "int"},
        {name: "group_name",type: "string",persist: false},
        {name: "name", type: "string"},
        {name: "short_description",type: "string"},
        {name: "description",type: "string"},
        {name : 'require_accounting_culc',type : 'int',
            convert : function(v) {
                return (v == true || v == 1) ? 1 : 0;
            }
            
        },
        {name: "images"},
        {name: "first_image",persist : false},
        {name: "codes"},
        {name: "files"}
    ],
    
    hasMany: [
        {
            model: "App.model.catalog.MaterialCodeModel",
            name: "getCodes",
            associationKey: "codes"
        },
        {
            model: "App.model.catalog.MaterialImageModel",
            name: "getImages",
            associationKey: "images"
        },
        {
            model: "App.model.catalog.MaterialFileModel",
            name: "getFiles",
            associationKey: "files"
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("catalog.materials.read"),
            create: Settings.urls.getUrl("catalog.materials.save"),
            update: Settings.urls.getUrl("catalog.materials.save"),
            destroy: Settings.urls.getUrl("catalog.materials.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});