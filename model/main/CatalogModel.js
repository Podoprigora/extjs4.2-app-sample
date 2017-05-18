Ext.define('App.model.main.CatalogModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {name: "id",type: "int"},
        {name: "group_name", type: "string"},
        {name: "name", type: "string" },
        {name: "short_description", type: "string"},
        {name: "first_image", type : 'string'}
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});