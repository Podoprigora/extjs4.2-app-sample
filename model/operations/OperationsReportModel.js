Ext.define('App.model.operations.OperationsReportModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
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
        name: "document",
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
        name: "w_name",
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
        name: "tw_name",
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
        type: "string",
        convert: function (value, record) {
            return (Ext.isEmpty(record.get("m_return_batch")) == false) ? record.get("m_return_batch") : value;
        }
    },
    {
        name: "m_return_batch",
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
            var result = Ext.String.format("{0},&nbsp;&nbsp;{1}", record.get("code"), Ext.util.Format.date(record.get("date"), "d.m.Y H:i"));
            
            var w = Ext.String.format("{0} - {1}", record.get("w_code"), record.get("w_name"));
            w = w.replace(/\,\s+$/, "");
            result += Ext.String.format(",&nbsp;&nbsp;<em>Склад:</em> {0}", w);
            
            if (Ext.isEmpty(record.get("tw_code")) == false) {
                var tw = Ext.String.format("{0} - {1}", record.get("tw_code"), record.get("tw_name"));
                tw = tw.replace(/\,\s+$/, "");
                if (record.get("type") == "incoming-transit") {
                    result += Ext.String.format(",&nbsp;&nbsp;<em>Склад отправитель:</em> {0}", tw);
                } else {
                    if (record.get("type") == "issue-transit") {
                        result += Ext.String.format(",&nbsp;&nbsp;<em>Склад получатель:</em> {0}", tw);
                    }
                }
            }

            if (record.get("document")) {
                result += Ext.String.format(",&nbsp;&nbsp;<em>Документ:</em> {0}", record.get("document"));
            }

            var uf = record.get("u_first_name"),
                ul = record.get("u_last_name"),
                up = record.get("u_patronymic"),
                user = Ext.String.format("{0} {1}. {2}.", ul, uf.substr(0, 1), up.substr(0, 1));
            user = user.replace(/\.\s\.$/, ".");
            result += Ext.String.format(",&nbsp;&nbsp;<em>Пользователь:</em> {0}", user);
                
            return result;
        }
    }],
    
    proxy: {
        type: "memory",
        reader: {
            type: "json"
        }
    }
    
});