Ext.define('App.model.bids.directories.SalesChannelModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'code', type : 'string'},
        {name : 'name', type : 'string'},
        {name : 'updated', type : 'date', dataFormat : 'Y-m-d H:i:s'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            create : Settings.urls.getUrl('bids.sales_channels.save'),
            update : Settings.urls.getUrl('bids.sales_channels.save'),
            destroy : Settings.urls.getUrl('bids.sales_channels.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});