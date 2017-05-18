Ext.define('App.model.plan.ReportGoodsTotalsModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'goods_id',
    
    fields : [
        {name : 'goods_id', type : 'int'},
        {name : 'goods_name', type : 'string'},
        {name : 'goods_image', type : 'string'},
        {name : 'lack_minutes', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});