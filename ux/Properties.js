Ext.define('App.ux.Properties', {
    alternateClassName : ['App.Properties'],
    
    singleton : true,
    
    records : null,  
    
    get : function(property) {
        return this.records[property];
    },
    
    set : function(property, value) {
        var obj = {};
        obj[property] = value;
        this.records = Ext.applyIf(obj, this.records);
    }
});