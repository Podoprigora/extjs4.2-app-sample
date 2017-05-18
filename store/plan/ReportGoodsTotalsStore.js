Ext.define('App.store.plan.ReportGoodsTotalsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ReportGoodsTotalsModel',
    
    autoLoad : false,
    remoteFilter : true,
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('plan.reports.goods_totals_list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});