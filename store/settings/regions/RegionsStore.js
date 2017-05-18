Ext.define('App.store.settings.regions.RegionsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.regions.RegionModel',
    
    autoLoad : false,
    
    pageSize : 500,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.regions.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});