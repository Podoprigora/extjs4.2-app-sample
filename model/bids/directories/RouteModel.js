Ext.define('App.model.bids.directories.RouteModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'priority', type : 'int', value : 0},
        {name : 'materials_allowed', type : 'int'},
        {name : 'total_mprice_from', type : 'float'},
        {name : 'mprice_from', type : 'float'},
        {name : 'updated', type : 'date', dateFormat : 'Y-m-d H:i:s', persist : false},
        {name : 'statuses', type : 'auto'},
        {name : 'tasks', type : 'auto'},
        {name : 'area_codes', type : 'auto'},
        {name : 'sales_channels', type : 'auto'},
        {name : 'roles', type : 'auto'}
    ],
    
    hasMany : [
        {
            model : 'App.model.bids.directories.StatusAssociationModel',
            name : 'getStatuses',
            associationKey : 'statuses'
        },
        {
            model : 'App.model.bids.directories.TaskAssociationModel',
            name : 'getTasks',
            associationKey : 'tasks'
        },
        {
            model : 'App.model.bids.directories.AreaCodeModel',
            name : 'getAreaCodes',
            associationKey : 'area_codes'
        },
        {
            model : 'App.model.bids.directories.RoleModel',
            name : 'getRoles',
            associationKey : 'roles'
        },
        {
            model : 'App.model.bids.directories.SalesChannelAssociationModel',
            name : 'getSalesChannels',
            associationKey : 'sales_channels'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.routing.read'),
            create : Settings.urls.getUrl('bids.routing.save'),
            update : Settings.urls.getUrl('bids.routing.save'),
            destroy : Settings.urls.getUrl('bids.routing.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});