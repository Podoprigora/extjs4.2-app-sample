Ext.define('App.model.bids.directories.StatusAccessRightNameModel', {
    extend : 'Ext.data.Model',
    
    idProperty : 'name',
    
    fields : [
        {name : 'name', type : 'string'},
        {name : 'title', type : 'string'}
    ],
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});