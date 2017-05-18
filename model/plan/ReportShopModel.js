Ext.define('App.model.plan.ReportShopModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'shop_id', type : 'int'},
        {name : 'shop_name', type : 'string'},
        {name : 'shop_code', type : 'string'},
        {name : 'shop_address', type : 'string'},
        {name : 'phone', type : 'string'},
        {name : 'date', type : 'date', dateFormat : 'Y-m-d'},
        {name : 'planogram_id', type  :'int'},
        {name : 'planogram_name', type : 'string'},
        {name : 'equipment_name', type : 'string'},
        {name : 'lack_minutes'},
        {name : 'equipments', type : 'auto'}
    ],
    
    hasMany: [{
        model: "App.model.plan.PlanogramEquipmentModel",
        name: "getEquipments",
        associationKey: "equipments"
    }],
    
    proxy: {
        type: "ajax",
        api: {
            read: Settings.urls.getUrl("plan.reports.shop_read")
        },
        reader: {
            type: "json"
        }
    }
    
});