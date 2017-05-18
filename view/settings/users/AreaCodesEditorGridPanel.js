Ext.define("App.view.settings.users.AreaCodesEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.UserAreaCodesEditorGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.users.AreaCodesLocalStore');
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        this.cls += " x-no-dirty"; 
        
        this.callParent(arguments);
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : this.onDeleteRow
                    }
                ]
            },
            {
                dataIndex : 'code',
                flex : 1
            }
        ];
    },
    
    buildDockedItems : function() {
        return [
            {
                dock : 'top',
                xtype : 'form',
                bodyPadding : 10,
                layout : 'hbox',
                items : [
                    {
                        xtype : 'AreaCodesListField',
                        emptyText : 'Выберите код',
                        width : 200,
                        listeners : {
                            scope : this,
                            select : function(field, record) {
                                this.fireEvent('selectfromdirectory', this, record);
                            }
                        }
                    }
                ]
            }
        ];
    },
    
    onDeleteRow : function(view, rowIndex, colIndex, item, e, record) {
        this.fireEvent('deletebtnclick', this, rowIndex, colIndex, item, e, record);    
    }
});