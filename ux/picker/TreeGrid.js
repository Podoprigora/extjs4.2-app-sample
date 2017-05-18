Ext.define('App.ux.picker.TreeGrid', {
    extend : 'App.ux.picker.Picker',
    alias : 'widget.uxTreeGridPicker',
    
    minPickerWidth: 400,
    minPickerHeight: 250,
    hideHeaders : true,
    selectOnlyLeaf : true,
    
    initComponent : function() {
        this.callParent(arguments);
    },
    
    createPicker : function() {
        var me = this,
            picker = new App.ux.tree.Panel({
                store : me.store,
                columns : this.buildColumns(),
                displayField : me.displayField,
                floating : true,
                minHeight : me.listHeight,
                maxHeight : me.listHeight,
                minWidth : me.listWidth,
                hideHeaders : me.hideHeaders,
                rootVisible : false,
                loadAllNodes : me.loadAllNodes,
                manageHeight : true,
                shadow : 'sides',
                shadowOffset : 10,
                frame : true,
                border : false,
                resizable : true,
                resizeHandles : 'se',
                shrinkWrapDock : 3,
                cls : 'x-panel-floating x-treegrid',
                listeners : {
                    scope : me,
                    itemclick : function(view, record) {
                        me.onSelectItem(record);
                    }
                },
                viewConfig : {
                    emptyText : '<p>Нет данных</p>',
                    stripeRows : false,
                    loadMask : false,
                    listeners : {
                        scope : me,
                        render : me.onViewRender
                    }
                }
            }),
            view = picker.getView();
        
        return picker;
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'treecolumn',
                dataIndex : 'name',
                flex : 1
            }
        ];
    },
    
    onInputChange : function(field, e) {
        var me = this;
        
        if (Ext.isFunction(e.isSpecialKey) && e.isSpecialKey() && e.getKey() != e.BACKSPACE) {
            return;
        }
        
        me.updateTriggers();
        
        field.tt = setTimeout(function(){
            if (Ext.isEmpty(field.tt) == false) {
                field.tt = null;
                
                if (Ext.isEmpty(me.getValue())) {
                    me.store.removeFilter(me.queryParam);
                    me.store.load();
                } else {
                    me.store.addFilter(me.queryParam, {'$like' : me.getValue()}); 
                    me.expand();
                }

            }
        }, 1200);
        
    },
    
    onExpand : function() {
        var me = this,
            rootNode = this.getStore().getRootNode();
        me.picker.getSelectionModel().deselectAll(); 
        me.getStore().load({
            callback : function() {
                rootNode.expand();
            }
        });
        me.focus(false, 200);   
    },
    
    onSelectItem : function(record) {
        this.clearInvalid();
        if (this.selectOnlyLeaf == true && ! record.isLeaf()) {
            this.markInvalid('Невозможно выбрать корневой элемент!');
            return this;
        } 
        
        this.callParent(arguments);
    }
    
});