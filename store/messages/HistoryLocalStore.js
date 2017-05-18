Ext.define('App.store.messages.HistoryLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.messages.MessageModel',
    
    autoLoad : true,
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});