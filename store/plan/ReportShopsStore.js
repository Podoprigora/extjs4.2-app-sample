
Ext.define('App.store.plan.ReportShopsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ReportShopModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    sorters : [
        {
            property : 'date',
            direction : 'DESC'
        }
    ],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('plan.reports.shops_list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});