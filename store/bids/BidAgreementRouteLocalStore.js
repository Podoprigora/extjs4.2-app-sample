Ext.define('App.store.bids.BidAgreementRouteLocalStore', {
    extend : 'Ext.data.Store',
    model : 'App.model.bids.BidAgreementRouteModel',
    
    proxy : {
        type : 'memory',
        reader : {
            type : 'json'
        }
    }
    
});