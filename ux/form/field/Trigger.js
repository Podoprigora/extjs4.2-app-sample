Ext.define('App.ux.form.field.Trigger', {
    extend: 'Ext.form.field.Trigger',
    alias: 'widget.uxTriggerField',
    
    trigger1Cls: 'x-form-choice-trigger',
    trigger2Cls: 'x-form-clear-trigger',
    trigger3Cls: 'x-form-place-trigger',
    trigger4Cls: 'x-form-search-trigger',
    hideTrigger2 : true,
    hideTrigger3 : true,
    hideTrigger4 : true,
    
    editable : false,
    allowBlank : true,
    
    initComponent: function(){
        this.callParent(arguments);
        
        this.addEvents('triggerclick', 'reset', 'trigger3click', 'trigger4click');
        
        this.on('focus', function(fl){
            if (this.selectOnFocus && this.readOnly !== true)
                this.onTrigger1Click();         
        }, this);
        
        if (this.allowBlank) {
            this.on('change', function(field, value){
                var me = this;

                if(Ext.isEmpty(me.triggerCell) == false) {
                    
                    if (me.readOnly) {
                        me.triggerCell.item(1).setDisplayed(false); 
                        me.updateLayout();
                        me.doComponentLayout();
                        return;
                    }
                    
                    if (value) {
                        me.triggerCell.item(1).setDisplayed(true);
                    } else {
                        me.triggerCell.item(1).setDisplayed(false);    
                    } 
                    me.updateLayout();
                    me.doComponentLayout();
                }
                
            }, this);    
        }
    },
    
    afterRender: function(){
        this.callParent();
        this.updateTriggers();
    },
    
    updateTriggers : function() {
        if (this.hideTrigger1) {
            this.triggerCell.item(0).setDisplayed(false);
        }
            
        if (this.hideTrigger2 && (Ext.isEmpty(this.getValue()) && this.allowBlank)) {
            this.triggerCell.item(1).setDisplayed(false);   
        }
            
        if (this.hideTrigger3) {
            this.triggerCell.item(2).setDisplayed(false);    
        }
            
        if (this.hideTrigger4) {
            this.triggerCell.item(3).setDisplayed(false);    
        }
            
        this.doComponentLayout();
    },
    
    onTrigger1Click : function() {
        this.fireEvent('triggerclick', this);
    },
    onTrigger2Click : function() {
        this.reset();
        this.fireEvent('reset', this);
    },
    onTrigger3Click : function() {
        this.fireEvent('trigger3click', this);
    },
    onTrigger4Click : function() {
        this.fireEvent('trigger4click');
    }
});