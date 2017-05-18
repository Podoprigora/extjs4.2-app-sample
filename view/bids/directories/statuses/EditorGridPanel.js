Ext.define("App.view.bids.directories.statuses.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryStatusesEditorGridPanel",
    
    hideHeaders : true,
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.StatusesLocalStore');
        this.viewConfig = this.buildViewConfig();
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();

        this.callParent(arguments);
        
        this.addEvents('deleteitemclick', 'selectfromdirectory');
    },
    
    buildViewConfig : function() {
        return {
            emptyText : '<p>Нет записей</p>',
            stripeRows : false,
            plugins: {
                ptype: 'gridviewdragdrop',
                dragField : 'name'
            }
        }    
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
            },
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : '<div class="col-icon icon-h-move" title="Изменить порядок (нажмите и перемещайте)">&nbsp;</div>'
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                xtype: "uxListPicker",
                store: Ext.create("App.store.bids.directories.StatusesStore"),
                columns : [
                    {
                        dataIndex : 'name',
                        flex : 1
                    }
                ],
                emptyText : 'Выберите статус',
                hideHeaders : true,
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