Ext.define('App.store.main.directories.HelpArticlesStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.main.directories.HelpArticleModel',
    
    autoLoad : false,
    buffered : true,
    
    pageSize : 80,
    leadingBufferZone : 25,
    
    remoteSort : true,
    remoteFilter : true,
    
    groupField : 'group_name',
    
    proxy : {
        type : 'ajax',
        url : Settings.urls.getUrl('main.directories.help_articles.list'),
        simpleSortMode : true,
        actionMethods : {
            read : 'POST'
        },
        reader : {
            type : 'json'
        }
    }
    
});