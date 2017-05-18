Ext.define('App.model.plan.EquipmentModel', {
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
            name: "ver_qty",
            type: "int"
        },
        {
            name: "hor_qty",
            type: "int"
        },
        {
            name: "start_index",
            type: "int"
        },
        {
            name: "ad_indexes",
            type: "string"
        },
        {
            name: "created",
            type: "date",
            dateFormat: "Y-m-d H:i:s"
        },
        {
            name: "updated",
            type: "date",
            dateFormat: "Y-m-d H:i:s"
        }
    ],
    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("plan.equipments.read"),
            create: Settings.urls.getUrl("plan.equipments.save"),
            update: Settings.urls.getUrl("plan.equipments.save"),
            destroy: Settings.urls.getUrl("plan.equipments.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});