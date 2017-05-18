
Ext.define('App.ux.data.Store', {
    extend : 'Ext.data.Store',
    
    construct : function(arguments) {
        
        this.callParent(arguments);
        
        this.on('load', this.onValidate, this);
        this.on('prefetch', this.onValidate, this);
    },
    
    onValidate : function(st) {
        App.ux.util.Response.validate(st.getProxy().getReader().rawData);
    }
});