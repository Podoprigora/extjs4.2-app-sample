Ext.define('App.store.settings.regions.CitiesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.regions.CityModel',
    
    autoLoad : false,
    
    pageSize : 2500,
    
    remoteSort : true,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('settings.regions.cities.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});