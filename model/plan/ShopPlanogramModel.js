Ext.define('App.model.plan.ShopPlanogramModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "planogram_id",
        type: "int"
    },
    {
        name: "planogram_name",
        type: "string"
    },
    {
        name: "start_date",
        type: "date",
        dateFormat: "Y-m-d"
    },
    {
        name: "end_date",
        type: "date",
        dateFormat: "Y-m-d"
    },
    {
        name: "start_date",
        type: "date",
        dateFormat: "Y-m-d"
    },
    {
        name: "removed",
        type: "int"
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});