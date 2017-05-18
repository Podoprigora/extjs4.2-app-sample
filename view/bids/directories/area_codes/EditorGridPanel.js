Ext.define("App.view.bids.directories.area_codes.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryAreaCodesEditorGridPanel",
    
    hideHeaders : true,
    viewConfig : {
        autoScroll : true,
        emptyText : '<p>Все территории</p>',
        stripeRows : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.AreaCodesLocalStore');
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
                dataIndex : 'code',
                flex : 1
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                xtype : 'AreaCodesListField',
                emptyText : 'Выберите код территории',
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