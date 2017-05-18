Ext.define("App.view.bids.directories.tasks.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryTasksEditorGridPanel",
    
    hideHeaders : true,
    viewConfig : {
        autoScroll : true,
        emptyText : '<p>Все задачи</p>',
        stripeRows : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.TasksLocalStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('deleteitemclick', 'selectfromdirectory');
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
                        scope : this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('deleteitemclick', this, record);
                        }
                    }
                ]
            },
            {
                dataIndex : 'name',
                flex : 1
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                xtype: "uxTreeGridPicker",
                store: Ext.create("App.store.bids.directories.TasksTreeStore", {
                    root: {
                        id: 0,
                        expanded: false
                    }
                }),
                loadAllNodes : false,
                emptyText : 'Выберите задачу',
                width : 200,
                listeners : {
                    scope : this,
                    select : function(field, record){
                        this.fireEvent('selectfromdirectory', this, record);
                    }
                }
            }
        ]    
    }
});