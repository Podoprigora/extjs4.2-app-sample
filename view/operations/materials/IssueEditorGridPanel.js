Ext.define("App.view.operations.materials.IssueEditorGridPanel", {
    extend : "App.view.operations.materials.BasicEditorGrid",
    alias : "widget.OperationIssueMaterialsEditorGridPanel",
    
    config : {
        warehouseId : null
    },
    
    initComponent : function() {
        
        this.store = Ext.create('App.store.operations.MaterialsLocalStore');
        
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
                header : 'Партия',
                dataIndex : 'batch',
                width : 120,
                align : 'center'
            },
            {
                header : 'Кол-во',
                dataIndex : 'qty',
                tdCls : 'x-cell-editing',
                width : 100,
                align : 'center',
                editor : {
                    xtype : 'numberfield',
                    selectOnFocus : true,
                    minValue : 0
                },
                renderer : this.qtyRenderer
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
                editor : {
                    xtype : 'numberfield',
                    selectOnFocus : true,
                    minValue : 0
                },
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
    
    buildTbar : function() {
        return [
           {
                xtype : 'AvailableMaterialsListField',
                fieldLabel : 'Подбор материалов',
                emptyText : 'Введите код, партию, наименование',
                width : 400,
                labelWidth : 130,
                labelAlign : 'right',
                tabIndex : 20,
                hidden : this.readOnly,
                //disabled : (! App.Identity.getRecord().isStorekeeper()),
                disabled : true,
                listeners : {
                    scope : this,
                    select : this.onSelectMaterialItem
                }
            },
            '->',
            { 
                xtype : 'component',
                itemId : 'labelSumQty',
                cls : 'x-component-grid-text-item',
                tpl : 'Всего: <b>{0}</b>'
            }, 
            {
                xtype : 'tbspacer',
                width : 10
            },
            { 
                xtype : 'component',
                itemId : 'labelSumAmount',
                cls : 'x-component-grid-text-item',
                tpl : 'Итого стоимость: <b>{0}</b>'
            },
            {
                xtype: "tbspacer",
                width: 10
            }
        ];
    }
    
});