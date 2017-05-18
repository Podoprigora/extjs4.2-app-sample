Ext.define('App.model.bids.BidCommentModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'id',
    
    fields : [
        {name : 'id', type : 'int'},
        {name : 'bid_id', type : 'int'},
        {name : 'user_id', type : 'int'},
        {name : 'user', type : 'string', persist : false},
        {name : 'user_role', type : 'string', persist : false},
        {name : 'created', type : 'date', dateFormat : 'Y-m-d H:i:s'},
        {name : 'message', type : 'string'}
    ],
    
    proxy : {
        type : 'ajax',
        api : {
            create : Settings.urls.getUrl('bids.comments.save'),
            destroy : Settings.urls.getUrl('bids.comments.destroy')
        },
        reader : {
            type : 'json'
        },
        writer : {
            type : 'json'
        }
    }
    
});