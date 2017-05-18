Ext.define('App.ux.picker.List', {
    extend : 'App.ux.picker.Picker',
    alias : 'widget.uxListPicker',
    
    dataIndex : 'name',
    columns : null,
    
    initComponent : function() {
        
        this.callParent(arguments);
    },
    
    createPicker : function() {
        var me = this,
            picker = new App.ux.grid.BasicGrid({
                store : me.store,
                columns : (me.columns || me.getDefaultColumns()),
                displayField : me.displayField,
                floating : true,
                minHeight : me.listHeight,
                maxHeight : me.listHeight,
                minWidth : me.listWidth,
                hideHeaders : me.hideHeaders,
                manageHeight : true,
                shadow : 'sides',
                shadowOffset : Ext.isIE8m ? 2 : 10,
                frame : true,
                border : false,
                resizable : true,
                resizeHandles : 'se',
                shrinkWrapDock : 3,
                cls : 'x-panel-floating',
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
            
            if (Ext.isEmpty(me.extraParams) == false) {
                me.store.getProxy().extraParams = me.extraParams;
            }
        
        return picker;
    },
    
    getDefaultColumns : function() {
        var me = this;
        return [
            {
                dataIndex : me.dataIndex,
                flex : 1
            }   
        ];
    }
    
});