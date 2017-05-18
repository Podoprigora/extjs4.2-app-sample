Ext.define('App.ux.form.field.Combo', {
    extend : 'Ext.form.field.ComboBox',
    alias : 'widget.uxCombo',
    
    valueField : 'id',
    displayField : 'name',
    triggerAction : 'all',
    editable : true,
    
    enableReset : false,
    trigger2Cls : 'x-form-clear-trigger',
    hideTrigger1 : false,
    hideTrigger2 : true,
    
    forceReload : false,
    refreshIfUpdate : false,
    
    queryParam : null,
    
    listConfig : {
        loadMask : true,
        loadingText : 'Загрузка ...'
    },
    
    initComponent : function() {
        
        
        if (this.forceReload == true) {
            this.plugins = [Ext.create('App.ux.form.field.ComboForceReload')];
        }
        
        this.callParent(arguments);
        
        if (this.editable) {
            this.on('beforequery', function(q){
                if (Ext.isEmpty(q.query)) {
                    this.getStore().removeFilter("query");
                    this.getStore().load();
                } else {
                    this.getStore().setFilter("query", {'$like' : q.query});    
                }
                
                return true;
            }, this);
            
            this.on('focus', function(field){
                if (this.editable) {
                    if (isNaN(field.getValue())){
                        field.reset();
                    }
                    this.getStore().removeFilter("query");
                    this.getStore().load();   
                }
            }, this);
        }
        
        if (this.enableReset) {
            this.on('change', this.onBeforeChange, this); 
            this.on('focus', this.onBeforeFocus, this);
        }
        
        this.relayEvents(this.getStore(), ['beforeload', 'load']);
    },
    
    afterRender: function(){
        this.callParent(arguments);
        this.updateTriggers();
    },
    
    onTrigger2Click : function() {
        this.reset();
        if (this.editable) {
            this.getStore().removeFilter("query");
            this.getStore().load();   
        }
        this.fireEvent('reset', this, null);
    },
    
    onBeforeChange : function(field, value) {
        if(Ext.isEmpty(this.triggerCell) == false) {
            this.updateLayout();
            if (this.readOnly) {
                this.triggerCell.item(1).setDisplayed(false); 
                this.updateLayout();
                return;
            }
            if (Ext.isArray(value) && value.length == 0) {
                this.triggerCell.item(1).setDisplayed(false); 
            } else if (value) {
                this.triggerCell.item(1).setDisplayed(true);
            } else {
                this.triggerCell.item(1).setDisplayed(false);    
            }
            this.triggerCell.item(0).setDisplayed(true);
        }
    },
    
    onBeforeFocus : function(field) {
        var value = field.getValue(),
            isEmpty = (Ext.isArray(value) && Ext.isEmpty(value[0])) || Ext.isEmpty(value);
        
        this.updateLayout();
        this.triggerCell.item(1).setDisplayed(! isEmpty);
        this.triggerCell.item(0).setDisplayed(true);
    },
    
    updateTriggers : function() {
        if (this.hideTrigger1) {
            this.triggerCell.item(0).setDisplayed(false);   
        }
        if (this.hideTrigger2) {
            this.triggerCell.item(1).setDisplayed(false);    
        }   
        if (this.hideTrigger3) {
            this.triggerCell.item(2).setDisplayed(false);    
        }
        if (this.hideTrigger4) {
            this.triggerCell.item(3).setDisplayed(false);   
        }
    }
    
});
