Ext.define('App.store.main.RecentNewsLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.main.directories.NewsModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});