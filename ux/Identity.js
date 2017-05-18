Ext.define('App.ux.Identity', {
    alternateClassName : ['App.Identity'],
    singleton : true,
    
    config : {
        record : null    
    },
    
    get : function(field) {
        return (this.record) ? this.getRecord().get(field) : null;
    }
});