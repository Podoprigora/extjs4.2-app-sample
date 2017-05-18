
Ext.define('App.model.plan.GoodsModel', {
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
            name: "image",
            type: "string"
        },
        {
            name: "image_path",
            type: "string",
            persist: false
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("plan.goods.read"),
            create: Settings.urls.getUrl("plan.goods.save"),
            update: Settings.urls.getUrl("plan.goods.save"),
            destroy: Settings.urls.getUrl("plan.goods.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});