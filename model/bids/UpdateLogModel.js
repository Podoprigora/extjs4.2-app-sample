Ext.define('App.model.bids.UpdateLogModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [
        { name: "id", type: "int" },
        { name: "bid_id", type: "int" },
        { name: "user_id", type: "int" },
        { name: "user", type: "string" },
        { name: "name", type: "string" },
        { name: "qty", type: "float" },
        { name: "status", type: "int" },
        { name: "created", type: "date", dateFormat : 'Y-m-d H:i:s' },
    
    {
        name: "group",
        type: "string",
        persist: false,
        convert: function (value, record) {
            return Ext.String.format(
                "{0},&nbsp;&nbsp;<em>Пользователь:</em> {1}", 
                Ext.util.Format.date(record.get("created"), "d.m.Y H:i"), record.get("user"));
        }
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});