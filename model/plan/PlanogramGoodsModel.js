Ext.define('App.model.plan.PlanogramGoodsModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        {
            name: "id",
            type: "int"
        },
        {
            name: "index",
            type: "int"
        },
        {
            name: "goods_id",
            type: "int"
        },
        {
            name: "pusher",
            type: "int"
        },
        {
            name: "goods_image",
            type: "string",
            persist: false
        },
        {
            name: "goods_name",
            type: "string",
            pesrsit: false
        },
        {
            name: "minutes",
            type: "int",
            persist: false
        },
        {
            name : 'removed',
            type : 'int'
        }
    ],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});