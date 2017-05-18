Ext.define('App.ux.grid.header_filters.FilterField', {
    extend : 'Ext.form.field.Trigger',
    alias : 'widget.uxFilterField',
    
    requires : [
        'App.ux.grid.header_filters.DateMenu',
        'App.ux.grid.header_filters.PriceMenu',
        'App.ux.grid.header_filters.NumberMenu'
    ],
    
    trigger2Cls: 'x-form-clear-trigger',
    hideTrigger1: true,
    hideTrigger2 : true,
    
    selectOnFocus : true,
    editable : false,
    menu : null,
    menuCls : null,
    valueParams : null,
    extraParams : null,
    
    menuItemsConfig : null,
    
    initComponent : function() {
        
        this.callParent(arguments);
        
        this.on('setfilter', this.onSetFilter, this);
        
        this.addEvents('setfilter', 'search', 'beforechange');
        
    },
    
    afterRender : function() {
        this.callParent(arguments); 
        
        this.updateTriggers();
        
        this.inputEl.on('mousedown', this.onShowMenu, this);
        
        this.on('change', function(field, value){
            var me = this;
            
            if (this.fireEvent('beforechange', field, value) === false) {
                return false;
            }
            
            if(Ext.isEmpty(me.triggerCell) == false) {
                me.triggerCell.item(1).setDisplayed(Ext.isEmpty(value) == false);
                me.updateLayout();
                
                if (Ext.isEmpty(me.valueParams)) {
                    if (Ext.isEmpty(me.menu) == false) {
                        me.menu.items.each(function(item){
                            if (item.isXType('numberfield')) {
                                item.setRawValue(null);
                            } 
                        });
                    }    
                }
            }
            if (field.isValid()) {
                this.fireEvent('setfilter', field, Ext.isEmpty(me.valueParams) ? value : me.valueParams);   
            }
            
        }, this);
    },
    
    onShowMenu : function() {
        var me = this;
        if (Ext.isEmpty(this.menuCls) == false) {
            if (Ext.isEmpty(this.menu)) {
                if (Ext.isEmpty(me.menuItemsConfig) == false) {
                    me.menu = Ext.create(me.menuCls, {
                        editorField : me,
                        itemsConfig : me.menuItemsConfig
                    });
                } else {
                    me.menu = Ext.create(me.menuCls, {
                        editorField : me
                    });   
                }
            }
    
            pos = me.el.getXY();
            me.menu.showAt(pos[0], pos[1] + me.getHeight());   
        }
    },
    
    onTrigger1Click : function() {
        this.onShowMenu();     
    },
    
    onTrigger2Click : function() {
        this.clearValueParams();
        this.reset();
    },
    
    updateTriggers : function() {
        if (this.hideTrigger1){
            this.triggerCell.item(0).setDisplayed(false);
        }  
        if (this.hideTrigger2) {
            this.triggerCell.item(1).setDisplayed(false);
        }
    },
    
    setValueParam : function(property, value) {
        
        if (Ext.isEmpty(this.valueParams)) {
            this.valueParams = {};    
        }
            
        this.valueParams[property] = value;
    },
    
    getValueParams : function() {
        return this.valueParams;
    },
    
    updateChanges : function() {
        this.reset();
        this.setValue(this.valueParams);
    },
    
    clearValueParams : function() {
        this.valueParams = null;    
    },
    
    onSetFilter : function(field, value) {
        var me = this;
        field.tt = true;
   
        setTimeout(function(){
            if (Ext.isEmpty(field.tt) == false) {
                me.fireEvent('search', field.getValue());
                field.tt = null;
            }
        }, 1000);
    }
});