Ext.define('App.ux.form.field.Search', {
    extend: 'Ext.form.field.Trigger',
    
    alias: 'widget.uxSearchField',
    
    trigger1Cls : 'x-form-clear-trigger',
    hideTrigger : true,
    tt : null,
    
    initComponent: function(){
        this.callParent(arguments);
        
        this.addEvents('search');
        
        this.on('change', function(field, e){
            var me = this;
            if (Ext.isEmpty(field.tt)) {
                field.tt = setTimeout(function(){
                    field.tt = undefined;
                    
                    value = field.getValue();
                    field.fireEvent('search', value);
                    
                    if (value.length > 0) {
                        me.triggerCell.item(0).setDisplayed(true);
                        me.updateLayout();
                    }
                    
                }, 1200);   
            }
        }, this);
    },
    
    onTrigger1Click : function() {
        this.reset();
        this.triggerCell.item(0).setDisplayed(false);
        this.updateLayout();
    }
    
});