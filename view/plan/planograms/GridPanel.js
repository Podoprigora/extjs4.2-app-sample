Ext.define("App.view.plan.planograms.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanogramsGridPanel",
    
    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.PlanogramsStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "deletebtnclick");
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                width: 400
            },
            {
                header : 'Оборудование',
                dataIndex : 'equipments',
                width : 400
            },
            {
                header: "Дата изменения",
                dataIndex: "updated",
                width: 140,
                align: "center",
                renderer: Ext.util.Format.dateRenderer("d.m.Y H:i:s")
            }, 
            {
                flex: 1
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить выкладку",
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
                width: 300,
                emptyText: "Введите наименование или оборудов.",
                editable: true,
                listeners: {
                    scope: this,
                    search: this.onChangeFilter
                }
            }, 
            "->", {
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
        var a = this.getSelectionModel().getCount();
        this.down("#btnEdit").setDisabled(a != 1);
        this.down("#btnDelete").setDisabled(a == 0);
    },
    
    onChangeFilter: function (a) {
        this.getStore().addFilter("query", (a) ? {
            "$like": a
        } : null);
    }
});