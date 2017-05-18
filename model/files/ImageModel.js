Ext.define('App.model.files.ImageModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'image',

    fields : [
        {name : 'id', type : 'int'},
        {name : 'image', type : 'string'},
        {name : 'image_from_mobile', type : 'string'},
        {name : 'removed', type : 'int'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});