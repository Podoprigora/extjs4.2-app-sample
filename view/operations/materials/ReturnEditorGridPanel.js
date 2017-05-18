Ext.define("App.view.operations.materials.ReturnEditorGridPanel", {
    extend : "App.view.operations.materials.BasicEditorGrid",
    alias : "widget.OperationReturnMaterialsEditorGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.operations.MaterialsLocalStore");
        this.callParent(arguments);
        
        this.on('edit', this.onEdit, this);
    },
    
    buildBatchesStore: function () {
        return Ext.create("App.store.operations.directories.CodesStore", {
            filters: [{
                property: "code",
                value: {
                    "$like": "u"
                }
            }],
            listeners: {
                scope: this,
                load: function () {
                    this.getView().refresh();
                }
            }
        })
    },
    
    buildColumns: function () {
        return [
            {
                xtype: "actioncolumn",
                width: 30,
                align: "center",
                items: [{
                    iconCls: "icon-delete",
                    tooltip: "Удалить",
                    scope: this,
                    handler: this.onDeleteRow
                }]
            },
            {
                header: "Партия",
                tdCls: "x-cell-editing",
                dataIndex: "batch",
                width: 120,
                align: "center",
                editor : {
                    xtype : 'uxListPicker',
                    store : Ext.create('App.store.operations.directories.CodesStore', {
                        filters: [{
                            property: "code",
                            value: {
                                "$like": "u"
                            }
                        }]
                    }),
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
                header: "Кол-во",
                dataIndex: "qty",
                tdCls: "x-cell-editing",
                width: 100,
                align: "center",
                editor: {
                    xtype: "numberfield",
                    selectOnFocus: true,
                    minValue: 0
                },
                renderer: this.qtyRenderer
            }, 
            {
                header: "Код",
                dataIndex: "code",
                align: "center",
                width: 100
            }, 
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1,
                minWidth: 160,
                renderer : this.wraptextRenderer
            }, 
            {
                header: "Цена, руб.",
                dataIndex: "price",
                width: 120,
                align: "right",
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }, 
            {
                header: "Сумма, руб.",
                dataIndex: "amount",
                width: 120,
                align: "right",
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }
        ];
    },
    
    onSelectBatch: function (field, record) {
        var grid = this,
            selRecord = grid.getSelectionModel().getSelection()[0];
        field.setValue(record.get('code'));
        if (Ext.isEmpty(selRecord) == false) {
            selRecord.set("return_code_id", record.get("id"));
        }
    },
    
    onEdit : function(editor, e) {
        if (e && e.field == 'batch' && (Ext.isEmpty(e.value) == false && Ext.isEmpty(e.record.get('return_code_id')))) {
            e.record.set('batch', '');
        }
    }
});