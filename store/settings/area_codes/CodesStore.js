Ext.define('App.store.settings.area_codes.CodesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.area_codes.CodeModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : false,
    remoteFilter : true,
    
    sorters : [
        {
            property : 'code',
            direction : 'ASC'
        }
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.area_codes.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});