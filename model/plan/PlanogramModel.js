Ext.define('App.model.plan.PlanogramModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {name: "id", type: "int" },
        {name: "name", type: "string"},
        {name: "updated", type: "date", dateFormat: "Y-m-d H:i:s", persist: false},
        {name : 'equipments', type : 'auto'}
    ],
    
    hasMany: [
        {
            model: "App.model.plan.PlanogramEquipmentModel",
            name: "getEquipments",
            associationKey: "equipments"
        }
    ],

    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("plan.planograms.read"),
            create: Settings.urls.getUrl("plan.planograms.save"),
            update: Settings.urls.getUrl("plan.planograms.save"),
            destroy: Settings.urls.getUrl("plan.planograms.destroy")
        },
        reader: {
            type: "json"
        },
        writer: {
            type: "json"
        }
    }
    
});