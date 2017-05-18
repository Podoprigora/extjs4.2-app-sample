Ext.define('App.model.operations.IncomingTransitModel', {
    extend : 'Ext.data.Model',
    
    idProperty: "id",
    
    fields: [{
        name: "id",
        type: "int"
    },
    {
        name: "operation_id",
        type: "int"
    },
    {
        name: "type",
        type: "string"
    },
    {
        name: "code",
        type: "string"
    },
    {
        name: "date",
        type: "date",
        dateFormat: "Y-m-d H:i:s"
    },
    {
        name: "w_code",
        type: "string"
    },
    {
        name: "w_city",
        type: "string"
    },
    {
        name: "w_address",
        type: "string"
    },
    {
        name: "tw_code",
        type: "string"
    },
    {
        name: "tw_city",
        type: "string"
    },
    {
        name: "tw_address",
        type: "string"
    },
    {
        name: "u_first_name",
        type: "auto"
    },
    {
        name: "u_last_name",
        type: "auto"
    },
    {
        name: "u_patronymic",
        type: "auto"
    },
    {
        name: "m_code",
        type: "string"
    },
    {
        name: "m_name",
        type: "string"
    },
    {
        name: "m_batch",
        type: "string"
    },
    {
        name: "m_qty",
        type: "float",
        convert: function (value) {
            return Math.abs(value);
        }
    },
    {
        name: "m_price",
        type: "float"
    },
    {
        name: "m_amount",
        type: "float",
        persist: false,
        convert: function (value, record) {
            return record.get("m_qty") * record.get("m_price");
        }
    },
    {
        name: "operation_full_name",
        type: "string",
        persist: false,
        convert: function (value, record) {
            var operation = Ext.String.format("{0},&nbsp;&nbsp;{1}", record.get("code"), Ext.util.Format.date(record.get("date"), "d.m.Y H:i"));
            var warehouse = Ext.String.format("{0} - {1}, {2}", record.get("w_code"), record.get("w_city"), record.get("w_address"));
            warehouse = warehouse.replace(/\,\s+$/, "");
            operation += Ext.String.format(",&nbsp;&nbsp;<em>Склад отправитель:</em> {0}", warehouse);
            //if (!App.Identity.getRecord().isStorekeeper()) {
                var tWarehouse = Ext.String.format("{0} - {1}, {2}", record.get("tw_code"), record.get("tw_city"), record.get("tw_address"));
                tWarehouse = tWarehouse.replace(/\,\s+$/, "");
                operation += Ext.String.format(",&nbsp;&nbsp;<em>Склад получатель:</em> {0}", tWarehouse);
            //}
            
            return operation;
        }
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});