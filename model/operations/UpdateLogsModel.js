Ext.define('App.model.operations.UpdateLogsModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "status",
        type: "int"
    },
    {
        name: "date",
        type: "date",
        dateFormat: "Y-m-d H:i:s"
    },
    {
        name: "first_name",
        type: "string"
    },
    {
        name: "last_name",
        type: "string"
    },
    {
        name: "patronumic",
        type: "string"
    },
    {
        name: "code",
        type: "string"
    },
    {
        name: "batch",
        type: "string"
    },
    {
        name: "name",
        type: "string"
    },
    {
        name: "qty",
        type: "float"
    },
    {
        name: "price",
        type: "float"
    },
    {
        name: "operation",
        type: "string",
        persist: false,
        convert: function (value, record) {
            return Ext.String.format(
                "{0},&nbsp;&nbsp;<em>Пользователь:</em> {1} {2} {3}", 
                Ext.util.Format.date(record.get("date"), "d.m.Y H:i"), record.get("first_name"), record.get("last_name"), (record.get("patronymic") || ""))
        }
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});