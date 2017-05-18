Ext.define('App.model.plan.ShopReportModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'user_id', type : 'int'},
        {name : 'user', type : 'string'},
        {name : 'created', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'comment', type : 'string'},
        {name : 'removed', type : 'int'},
        {name : 'images', type : 'auto'}
    ],
    
    hasMany : [
        {
            model : 'App.model.files.ImageModel',
            name : 'getImages',
            associationKey : 'images'
        }
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : '',
            create : '',
            update : '',
            destroy : ''
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});