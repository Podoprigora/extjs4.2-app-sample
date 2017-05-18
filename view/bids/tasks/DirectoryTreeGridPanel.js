Ext.define("App.view.bids.tasks.DirectoryTreeGridPanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.BidTasksDirectoryTreeGridPanel",
    
    rootVisible: false,
    columnLines: true,
    loadAllNodes : false,
    config: {
        callEditor: null,
        revertSpecialKey: false
    },    
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.TasksTreeStore', {
            filters : [{
                property : 'visible',
                value : 'ordering'
            }]
        });
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = [Ext.create('Ext.grid.plugin.BufferedRenderer')]; 
        
        this.callParent(arguments);
        
        this.addEvents("selectitemclick");

    },
    
    buildTbar : function() {
        return [
            {
                xtype : 'uxFilterField',
                fieldLabel : 'Найти',
                emptyText : 'Введите наименование',
                editable : true,
                width : 350,
                labelWidth : 40,
                minLength : 3,
                labelAlign : 'right',
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.getStore().addFilter('query', (value.length) ? {'$like' : value} : null);
                    }
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
            }
        ];    
    },
    
    buildColumns: function () {
        return [
            {
                xtype: "actioncolumn",
                width: 35,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-create-dark", "Выбрать"),
                        scope: this,
                        handler : function(view, rowIndex, colIndex, item, e, node) {
                            this.fireEvent('selectitemclick', view, node);
                        }
                    }
                ]
            },
            {
                xtype: "treecolumn",
                header: "Наименование",
                dataIndex: "name",
                minWidth: 380,
                flex : 1
            },
            {
                header: "Тип",
                dataIndex: "type",
                align : 'center',
                width: 100
            },
            {
                header : 'Описание',
                dataIndex : 'desc',
                flex : 1,
                renderer : this.descRenderer
            }
        ];
    },
    
    onActionColumnGetClass: function (iconCls, tooltip) {
        return function (v, metaData, record) {
            if (! record.isLeaf()) {
                return '';
            }
            if (Ext.isEmpty(tooltip) == false) {
                metaData.tdAttr = Ext.String.format("data-qtip='{0}'", tooltip);   
            }
            return iconCls;
        }
    },
    
    descRenderer : function(v, metaData, record) {
        if (v && v.length > 20) {
            metaData.tdAttr = Ext.String.format("data-qtip='{0}'", v);
        }
        return v;   
    }
});