Ext.define('App.store.plan.SmsLogStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.plan.SmsLogModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    groupField : 'groupdate',
    
    sorters : [{
        property : 'date',
        direction : 'DESC'
    }],
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('plan.smslog.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});