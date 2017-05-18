Ext.define('App.model.bids.directories.StatusModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'position', type : 'int'},
        {name : 'roles', type : 'auto'},
        {name : 'access_rights', type : 'auto'},
        {name : 'is_hidden', type : 'int', convert : function(v){
            return (v == 1 || v == true) ? 1 : 0;
        }},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.directories.RoleModel',
            name : 'getRoles',
            associationKey : 'roles'
        },
        {
            model : 'App.model.bids.directories.StatusAccessRightModel',
            name : 'getAccessRights',
            associationKey : 'access_rights'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.statuses.read'),
            create : Settings.urls.getUrl('bids.statuses.save'),
            update : Settings.urls.getUrl('bids.statuses.save'),
            destroy : Settings.urls.getUrl('bids.statuses.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});