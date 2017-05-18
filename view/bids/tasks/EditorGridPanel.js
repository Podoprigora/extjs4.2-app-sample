Ext.define("App.view.bids.tasks.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidTasksEditorGridPanel",
    
    cls : 'x-no-dirty',
    
    config : {
        readOnly : false,
        readOnlyMaterials : true
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.BidTasksLocalStore');
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        this.plugins = this.buildPlugins();
        
        this.callParent(arguments);
        
        this.addEvents('addtaskbtnclick', 'addmaterialitemclick', 'deleteitemclick');
        
        this.on('cellclick', this.onCellClick, this);
    },
    
    buildPlugins : function() {
        return [{
            ptype : 'cellediting',
            pluginId : 'cellEditing',
            clicksToEdit : 1
        }];  
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                hidden : this.readOnly,
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : function(view, rowIndex, colIndex, item, e, record) {
                            this.fireEvent('deleteitemclick', this, record);
                        }
                    }
                ]
            },
            {
                header : 'Кол-во',
                dataIndex : 'qty',
                width : 80,
                align : 'center',
                getEditor : this.getQtyEditor,
                renderer : this.qtyRenderer
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1,
                renderer : this.wraptextRenderer
            },
            {
                header: "Тип",
                dataIndex: "type",
                align : 'center',
                width: 100
            },
            {
                xtype  : 'templatecolumn',
                header : 'Материал',
                width : 80,
                align : 'center',
                hidden : this.readOnlyMaterials,
                tpl : [
                    '<tpl if="need_equipment == 1">',
                        '<div class="x-action-col-icon icon-create-dark" data-qtip="Добавить материалы">&nbsp;</div>',
                    '<tpl else>',
                        '-',
                    '</tpl>'
                ]
            }
        ];     
    },
    
    buildDockedItems : function() {
        return [
            {
                xtype : 'toolbar',
                dock : 'top',
                hidden : this.readOnly,
                items : [
                    {
                        text : 'Добавить задачи',
                        itemId : 'btnAddTask',
                        iconCls : 'icon-create',
                        disabled : true,
                        scope : this,
                        handler : function() {
                            this.fireEvent('addtaskbtnclick', this);
                        }
                    }
                ]
            }
        ];
    
    },
    
    onCellClick : function(grid, td, cellIndex, record, tr, rowIndex, e) {
        if (e.target.className.indexOf('x-action-col-icon icon-create-dark') > -1) {
            this.fireEvent('addmaterialitemclick', this, record);    
        }
    },
    
    getQtyEditor : function(record) {
        if (record.get('countable') == 0 || (record.get('countable') == 1 && record.get('need_equipment') == 1) || this.readOnly) {
            return false;    
        }
        return {
            xtype : 'numberfield',
            selectOnFocus : true,
            minValue : 0
        }; 
    },
    
    qtyRenderer : function(v, metaData, record) {
        if ((record.get('countable') == 1 && record.get('need_equipment') == 0) && this.readOnly == false) {
            metaData.tdCls = "x-cell-editing";
        }
        return v;
    }
});