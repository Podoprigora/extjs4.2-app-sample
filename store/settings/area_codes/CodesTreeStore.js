Ext.define('App.store.settings.area_codes.CodesTreeStore', {
    extend : 'Ext.data.TreeStore',
    model : 'App.model.settings.area_codes.CodeModel',
    
    autoLoad : false,
    remoteSort : true,
    
    sorters : [
        {
            property : 'code',
            direction : 'ASC'
        }
    ],
    
    root : {
        id : 0,
        name : 'Все категории',
        expanded : false
    },
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.area_codes.list'),
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json',
            totalProperty : 'count',
            root : 'records'
        }
    }
    
});