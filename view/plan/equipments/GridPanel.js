Ext.define("App.view.plan.equipments.GridPanel", {
	extend : "App.ux.grid.BasicGrid",
	alias : "widget.PlanEquipmentsGridPanel",

	selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.EquipmentsStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildPlugins: function () {
        return [{
            ptype: "cellediting",
            pluginId: "cellEditing",
            clicksToEdit: 2
        }]
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                width: 350
            }, 
            {
                header: "Ячеек по горизонтали",
                dataIndex: "hor_qty",
                width: 100,
                align: "center"
            }, 
            {
                header: "Ячеек по вертикали",
                dataIndex: "ver_qty",
                width: 100,
                align: "center"
            },
            {
                header: "Начальный индекс",
                dataIndex: "start_index",
                width: 100,
                align: "center"
            },
            {
                header: "Вставка (индексы ячеек)",
                dataIndex: "ad_indexes",
                flex : 1
            },
            {
                header: "Дата изменения",
                dataIndex: "updated",
                width: 140,
                align: "center",
                renderer: Ext.util.Format.dateRenderer("d.m.Y H:i:s")
            }
        ]
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить оборудование",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
                }
            },
            {
                tooltip : "Редактировать",
                itemId: "btnEdit",
                disabled: true,
                iconCls: "icon-edit",
                scope: this,
                handler: function () {
                    this.fireEvent("editbtnclick", this);
                }
            },
            {
                tooltip : "Удалить",
                itemId: "btnDelete",
                disabled: true,
                iconCls: "icon-delete",
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this);
                }
            }, 
            {
                xtype: "uxFilterField",
                fieldLabel: "Поиск",
                labelAlign: "right",
                labelWidth: 60,
                width: 250,
                emptyText: "Введите наименование",
                editable: true,
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            }, "->", {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, {
                xtype: "tbspacer"
            }, {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, {
                xtype: "tbspacer"
            }
        ];
    },
    
    onToggleBtns: function () {
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnEdit").setDisabled(selCount != 1);
        this.down("#btnDelete").setDisabled(selCount < 1);
    },
    
    onChangeFilter: function (value) {
        this.getStore().addFilter("name", (value) ? {
            "$like": value
        } : null);
    }

});