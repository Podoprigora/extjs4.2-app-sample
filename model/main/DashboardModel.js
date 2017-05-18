Ext.define('App.model.main.DashboardModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    idgen : 'sequential',
    fields : [
        {name : 'news'},
        {name : 'slider'},
        {name : 'catalog'},
        {name : 'help_articles'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : Settings.urls.getUrl('main.dashboard.read')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});