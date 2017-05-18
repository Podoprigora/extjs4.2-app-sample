Ext.define('App.store.plan.ReportLackOfGoodsStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.ReportLackOfGoodsModel',
    
    autoLoad: false,
    buffered: true,
    
    pageSize: 80,
    leadingBufferZone: 25,
    
    remoteSort: true,
    remoteFilter: true,
    remoteGroup: true,
    groupField: "group_name",
    
    sorters: [{
        property: "lack_minutes",
        direction: "DESC"
    }],
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("plan.reports.goods_list"),
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
    
});