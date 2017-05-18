Ext.define('App.store.settings.users.AvailableWarehousesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.users.AvailableWarehouseModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.users.available_warehouses.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});