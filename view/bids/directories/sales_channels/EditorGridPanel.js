Ext.define("App.view.bids.directories.sales_channels.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectorySalesChannelsEditorGridPanel",
    
    hideHeaders : true,
    
    viewConfig : {
        autoScroll : true,
        emptyText : '<p>Все каналы сбыта</p>',
        stripeRows : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.SalesChannelsLocalStore');
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
                xtype : 'uxCombo',
                store : Ext.create('App.store.bids.directories.SalesChannelsStore'),
                emptyText : 'Выберите канал сбыта',
                width : 200,
                listeners : {
                    scope : this,
                    select : function(field, records){
                        field.reset();
                        this.fireEvent('selectfromdirectory', this, records[0]);
                    }
                }
            }
        ]    
    }
});