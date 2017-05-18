Ext.define('App.model.bids.PerformanceReportModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'bid_id', type : 'int'},
        {name : 'user_id', type : 'int'},
        {name : 'user', type  :'string', persit : false},
        {name : 'area_code', type : 'int', persist : false},
        {name : 'completed_date', type : 'date', dateFormat : 'Y-m-d'},
        {name : 'comment', type : 'string'},
        {name : 'tasks', type : 'auto'},
        {name : 'images', type : 'auto'}
    ],
    
    
    hasMany : [
        {
            model : 'App.model.bids.PerformanceReportTaskModel',
            associationKey : 'tasks',
            name : 'getTasks'
        },
        {
            model : 'App.model.files.ImageModel',
            associationKey : 'images',
            name : 'getImages'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('bids.performance_report.read'),
            create : Settings.urls.getUrl('bids.performance_report.save'),
            update : Settings.urls.getUrl('bids.performance_report.save'),
            destroy : Settings.urls.getUrl('bids.performance_report.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});