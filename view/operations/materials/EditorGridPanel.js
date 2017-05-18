Ext.define("App.view.operations.materials.EditorGridPanel", {
    extend : "App.view.operations.materials.BasicEditorGrid",
    alias : "widget.OperationMaterialsEditorGridPanel",
    
    config : {
        batchesStore : null
    },
    
    initComponent : function() {
        
        this.store = Ext.create('App.store.operations.MaterialsLocalStore');
        //this.batchesStore = this.buildBatchesStore();
        
        this.callParent(arguments);
        
        this.on('edit', this.onEdit, this);
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
                        handler : this.onDeleteRow
                    }
                ]
            },
            {
                header : 'Партия',
                tdCls : ((this.readOnly) ? '' : 'x-cell-editing'),
                dataIndex : 'batch',
                width : 120,
                align : 'center',
                editor : {
                    xtype : 'uxListPicker',
                    store : Ext.create('App.store.operations.directories.CodesStore'),
                    dataIndex : 'code',
                    hideHeaders : true,
                    listWidth : 80,
                    listeners : {
                        scope : this,
                        select : this.onSelectBatch
                    }
                }
            },
            {
                header : 'Кол-во',
                dataIndex : 'qty',
                tdCls : ((this.readOnly) ? '' : 'x-cell-editing'),
                width : 100,
                align : 'center',
                editor : {
                    xtype : 'numberfield',
                    selectOnFocus : true,
                    minValue : 0
                }
            },
            {
                header : 'Код',
                dataIndex : 'code',
                align : 'center',
                width : 100
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1,
                minWidth : 160,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Цена, руб.',
                dataIndex : 'price',
                width : 120,
                align : 'right',
                getEditor : this.getPriceEditor,
                renderer : Ext.util.Format.numberRenderer('0,0.00')
            },
            {
                header : 'Сумма, руб.',
                dataIndex : 'amount',
                width : 120,
                align : 'right',
                renderer : Ext.util.Format.numberRenderer('0,0.00')
            }
        ];
    },
    
    getPriceEditor : function(record) {
        return {
            xtype : 'numberfield',
            selectOnFocus : true,
            minValue : 0
        };
    },
    
    onEdit : function(editor, e) {
        if (e && e.field == 'batch' && (Ext.isEmpty(e.value) == false && Ext.isEmpty(e.record.get('code_id')))) {
            e.record.set('batch', '');
        }
    }
    
});