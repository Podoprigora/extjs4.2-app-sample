Ext.define('App.model.plan.PlanogramEquipmentModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'equipment_id', type : 'int'},
        {name : 'equipment', type : 'auto'},
        {name : 'start_pusher', type : 'int'},
        {name : 'end_pusher', type : 'int'},
        {name : 'lack_totals', type : 'int'},
        {name : 'goods', type : 'auto'}
    ],
    
    hasMany: [
        {
            model: "App.model.plan.PlanogramGoodsModel",
            name: "getGoods",
            associationKey: "goods"
        }
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});