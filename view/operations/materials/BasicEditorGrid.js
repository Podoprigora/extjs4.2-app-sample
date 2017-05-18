Ext.define("App.view.operations.materials.BasicEditorGrid", {
    extend : "App.ux.grid.BasicGrid",
    
    cls: "x-no-dirty",
    readOnly: false,
    config: {
        batchesStore: null
    },
    
    initComponent: function () {
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        if (!this.readOnly) {
            this.plugins = this.buildPlugins()
        }
        
        this.callParent(arguments);
        
        this.addEvents("selectmaterialfromdirectory", "selectbatchfromdirectory", "deleteitem");
        this.getView().on("refresh", this.onUpdateTotalsLabels, this);
        this.getStore().on("update", this.onUpdateTotalsLabels, this);
    },
    
    buildPlugins: function () {
        return [{
            ptype: "cellediting",
            pluginId: "cellEditing",
            clicksToEdit: 1
        }]
    },
    
    buildColumns: Ext.emptyFn,
    
    buildTbar: function () {
        return [{
            xtype: "MaterialsListField",
            fieldLabel: "Подбор материалов",
            emptyText: "Введите код, наименование",
            width: 400,
            labelWidth: 130,
            labelAlign: "right",
            tabIndex: 20,
            hidden: this.readOnly,
            listeners: {
                scope: this,
                select: this.onSelectMaterialItem
            }
        }, "->", {
            xtype: "component",
            itemId: "labelSumQty",
            cls: "x-component-grid-text-item",
            tpl: "Всего: <b>{0}</b>"
        }, {
            xtype: "tbspacer",
            width: 10
        }, {
            xtype: "component",
            itemId: "labelSumAmount",
            cls: "x-component-grid-text-item",
            tpl: "Итого стоимость: <b>{0}</b>"
        }, {
            xtype: "tbspacer",
            width: 10
        }];
    },
    
    onUpdateTotalsLabels: function () {
        var lQty = this.down("#labelSumQty"),
            lAmount = this.down("#labelSumAmount"),
            total = 0;
            
        lQty.update([this.getStore().getCount()]);
        this.getStore().each(function (item) {
            total += item.get("amount");
        });
        lAmount.update([Ext.util.Format.number(total, "0,0.00")]);
    },
    
    qtyRenderer: function (value, metaData, record) {
        if (record.get("available_qty") > 0 && (value > record.get("available_qty"))) {
            metaData.tdAttr = Ext.String.format('data-qtip="Значение некорректно, на складе доступно <b>{0}</b> единиц!"', record.get("available_qty"));
            metaData.tdCls = "x-cell-red";
        } else {
            metaData.tdAttr = "";
        }
        return value;
    },
    
    onSelectBatch: function (field, record) {
        var grid = this,
            selRecord = grid.getSelectionModel().getSelection()[0];
        field.setValue(record.get('code'));
        if (Ext.isEmpty(selRecord) == false) {
            selRecord.set("code_id", record.get("id"));
        }
    },
    
    onDeleteRow: function (view, rowIndex, colIndex, item, e, record) {
        this.fireEvent("deleteitem", this, record);
    },
    
    onSelectMaterialItem: function (field, record) {
        this.fireEvent("selectmaterialfromdirectory", this, field, record);
    },
    
    onSelectBatchItem: function (field, record) {
        this.fireEvent("selectbatchfromdirectory", this, field, record);
    }
});