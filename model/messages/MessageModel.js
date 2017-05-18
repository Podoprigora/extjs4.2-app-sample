Ext.define('App.model.messages.MessageModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'parent_id', type : 'int'},
        {name : 'recipient_id', type : 'int'},
        {name : 'sender_id', type : 'int'},
        {name : 'recipient_last_name', type : 'string', persist : false},
        {name : 'recipient_first_name', type : 'string', persist : false},
        {name : 'recipient_patronymic', type : 'string', persist : false},
        {name : 'recipient', type : 'string', persist : false, convert : function(v, record){
            return [record.get('recipient_last_name'), record.get('recipient_first_name'), record.get('recipient_patronymic')].join(" ");
        }},
        {name : 'sender_last_name', type : 'string', persist : false},
        {name : 'sender_first_name', type : 'string', persist : false},
        {name : 'sender_patronymic', type : 'string', persist : false},
        {name : 'sender', type : 'string', persist : false, convert : function(v, record){
            return [record.get('sender_last_name'), record.get('sender_first_name'), record.get('sender_patronymic')].join(" ");
        }},
        {name : 'user', type : 'string', persist : false, convert : function(v, record){
            if (App.Identity.getRecord().get('id') == record.get('sender_id')) {
                return record.get('recipient');
            }
            return record.get('sender');
        }},
        {name : 'is_author', persit : false, convert : function(v, record){
            if (App.Identity.getRecord().get('id') == record.get('sender_id')) {
                return true;
            }
            return false;      
        }},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false},
        {name : 'created', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false},
        {name : 'message', type : 'string'},
        {name : 'is_read', persist : false},
        {name : 'unread_count', type : 'int', persist : false},
        {name : 'has_files', type : 'int', persist : false},
        {name : 'files', type : 'auto'}
    ],
    
    hasMany : [
        {
            model : 'App.model.messages.MessageModel',
            name : 'getHistory',
            associationKey : 'history'
        },
        {
            model : 'App.model.files.FileModel',
            name : 'getFiles',
            associationKey : 'files'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('messages.read'),
            create : Settings.urls.getUrl('messages.save'),
            update : Settings.urls.getUrl('messages.save'),
            destroy : Settings.urls.getUrl('messages.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});