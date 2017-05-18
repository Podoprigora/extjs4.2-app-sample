Ext.define('App.model.bids.directories.ShopModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'area_code', type : 'int'},
        {name : 'name', type : 'string'},
        {name : 'legal_name', type : 'string'},
        {name : 'city', type : 'string'},
        {name : 'address1', type : 'string'},
        {name : 'address2', type : 'string'},
        {name : 'rka', type : 'string'},
        {name : 'contact', type : 'string'},
        {name : 'gps', type : 'string'},
        {name : 'updated', type : 'date', dataFormat : 'Y-m-d H:i:s', persist : false}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            read : '',
            create : '',
            update : Settings.urls.getUrl('bids.shops.save'),
            destroy : Settings.urls.getUrl('bids.shops.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});