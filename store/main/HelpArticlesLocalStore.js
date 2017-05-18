Ext.define('App.store.main.HelpArticlesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.main.directories.HelpArticleModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});