Ext.define('App.store.plan.GoodsStore', {
    extend : 'Ext.data.Store',
    model: "App.model.plan.GoodsModel",
    
    autoLoad: false,
    pageSize: 100,
    remoteSort: true,
    remoteFilter: true,
    
    proxy: {
        type: "ajax",
        url: Settings.urls.getUrl("plan.goods.list"),
        simpleSortMode: true,
        actionMethods: {
            read: "POST"
        },
        reader: {
            type: "json"
        }
    }
});