Ext.define('App.model.plan.ReportLackOfGoodsModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'phone', type : 'string'},
        {name : 'pusher', type : 'int'},
        {name : 'lack_minutes', type : 'int'},
        {name : 'date', type : 'date', dateFormat : 'Y-m-d'},
        {name : 'shop_id', type : 'int'},
        {name : 'planogram_id', type : 'int'},
        {name : 'shop_code', type : 'string'},
        {name : 'shop_name', type : 'string'},
        {name : 'shop_address', type : 'string'},
        {name : 'equipment_name', type : 'string'},
        {name : 'equipment_start_pusher', type : 'int'},
        {name : 'equipment_end_pusher', type : 'int'},
        {name : 'planogram_name', type : 'string'},
        {name : 'goods_name', type : 'string'},
        {name : 'group_name', type : 'string', convert : function(v, record){
            var date = Ext.util.Format.date(record.get("date"), 'd.m.Y');
            if (Ext.isEmpty(date) == false) {
                if (record.get('equipment_end_pusher') > 0) {
                    return Ext.String.format(
                        "{0}, {1}, &nbsp;<em>Точка:</em> {2} {3}, &nbsp;<em>Выкладка:</em> {4}, &nbsp;<em>Оборудование:</em> {5} ({6}-{7})", 
                        record.get("phone"), date, record.get('shop_code'), record.get('shop_name'), record.get('planogram_name'), 
                        record.get('equipment_name'), record.get('equipment_start_pusher'), record.get('equipment_end_pusher'));   
                } else {
                    return Ext.String.format(
                        "{0}, {1}, &nbsp;<em>Точка:</em> {2} {3}, &nbsp;<em>Выкладка:</em> {4}, &nbsp;<em>Оборудование:</em> {5}", 
                        record.get("phone"), date, record.get('shop_code'), record.get('shop_name'), record.get('planogram_name'), record.get('equipment_name'));    
                }
                
            } else {
                return Ext.String.format(
                    "{0}, &nbsp;<em>Точка:</em> {1} {2}", 
                    record.get("phone"), record.get('shop_code'), record.get('shop_name'));
            }
        }}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});