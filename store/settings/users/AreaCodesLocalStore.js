Ext.define('App.store.settings.users.AreaCodesLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.settings.users.AreaCodeModel',
    
    sorters : [
        {
            property : 'code',
            direction : 'asc'
        }
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});