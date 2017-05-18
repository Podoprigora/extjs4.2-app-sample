Ext.define("App.ux.form.field.ComboForceReload", {
    extend : 'Ext.AbstractPlugin',
    alias : 'plugin.uxComboForceReload',
    
    init : function(field) {
        var combo = field;
        combo.on('focus', function() { 
            combo.store.load();        
        });
    }
});