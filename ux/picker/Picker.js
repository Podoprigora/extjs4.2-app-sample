Ext.define('App.ux.picker.Picker', {
    extend : 'Ext.form.field.Picker',
    
    uses : [
        'App.ux.grid.BasicGrid'
    ],
    
    trigger1Cls: 'x-form-search-trigger',
    trigger2Cls: 'x-form-clear-trigger',
    hideTrigger2 : true,
    enableKeyEvents : true,
    editable : true,
    selectFirstItem : true,
    queryParam : 'query',
    
    config : {
        store : null,
        columns : [],
        displayField : null,
        extraParams : null,
        hideHeaders : false,
        
        selectOnTab : true,
        listHeight : 200,
        listWidth : 450
    },
    
    initComponent : function() {
        
        this.callParent(arguments);
        
        this.on('keydown', this.onInputChange, this);
        this.on('paste', this.onPaste, this, {element : 'inputEl', delay : 1});
        this.on('clearfield', this.onInputChange, this);
        this.on('change', this.updateTriggers, this);
        this.on('focus', this.expand, this);
        this.on('blur', this.collapse, this);
        
        this.addEvents('clearfield', 'select');
    },
    
    onInputChange : function(field, e) {
        var me = this;

        if (Ext.isEmpty(e) == false && Ext.isEmpty(e.type) == false 
            && ((e.isSpecialKey() && e.getKey() != e.BACKSPACE && e.getKey() != e.DELETE) || (e.ctrlKey && e.getKey() == e.V))) {
            
            return;
        }
        
        me.updateTriggers();
        
        field.tt = setTimeout(function(){
            if (Ext.isEmpty(field.tt) == false) {
                field.tt = null;

                if (Ext.isEmpty(me.getValue())) {
                    me.store.removeFilter(me.queryParam);
                    me.store.loadPage(1);
                } else {
                    me.store.addFilter(me.queryParam, {'$like' : me.getValue()}); 
                    me.expand();
                }

            }
        }, 1200);
        
    },
    
    onPaste : function(e, inputEl) {        
        var me = this;
        
        e.stopEvent();

        me.store.addFilter(me.queryParam, {'$like' : me.getValue()}); 
        me.expand();
    },
    
    createPicker : Ext.emptyFn,
    
    expand : function(){
        if (this.readOnly == false){
            this.store.removeFilter(this.queryParam); 
            this.updateTriggers();
            this.callParent(arguments);
        } else {
            return false;   
        }
    },
    
    onExpand : function() {
        var me = this;
        if (me.readOnly == false) {
            me.picker.getSelectionModel().deselectAll(); 
            me.getStore().load();
            me.focus(false, 200); 
        }
    },
    
    afterRender: function(){
        
        var me = this;
        
        this.callParent(arguments);
        
        this.updateTriggers();
        
        this.mon(this, "specialkey", function(field, e){
            if (me.isExpanded) {
                grid = me.picker;
                if (e.getKey() == e.DOWN || e.getKey() == e.ENTER) {
                    grid.getSelectionModel().select(0);
                }
            }
        }, this);
    },
    
    onViewRender : function(view) {
        view.getEl().on('keydown', this.onPickerKeydown, this);
    },
    
    onPickerKeydown : function(e, el) {
        e.stopEvent();
        var key = e.getKey();
        if (key === e.ENTER ) {
            this.onSelectItem(this.picker.getSelectionModel().getSelection()[0]);
        }
    },
   
    onSelectItem : function(record) {
        this.collapse();
        this.store.removeFilter(this.queryParam);
        this.setValue('');
        this.focus(false, 100);
        this.fireEvent('select', this, record);
    },
    
    onAfterLoadRecords : function(field, store, records) {
        if (this.selectFirstItem == true) {
            field.picker.getSelectionModel().select(0);    
        } 
    },
    
    updateTriggers : function() {
        var me = this;
        if (me.isVisible() && me.readOnly == false) {
            if (me.value || ! this.hideTrigger2) {
                me.triggerCell.item(1).setDisplayed(true);
            } else {
                me.triggerCell.item(1).setDisplayed(false);    
            } 
        }
        me.updateLayout();
    },
    
    onTrigger2Click : function() {
        this.clean();
    },
    
    clean : function() {
        this.store.removeFilter(this.queryParam);
        this.setValue('');
        this.fireEvent('clearfield', this);
    }
    
});