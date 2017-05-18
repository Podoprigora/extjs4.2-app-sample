Ext.define("App.view.plan.scripts.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanScriptsGridPanel",

    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ScriptsStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.callParent(arguments);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
        
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                width: 250
            }, 
            {
                header: "Правила",
                dataIndex : 'rules',
                sortable : false,
                width: 350
            }, 
            {
                header: "Дата изменения",
                dataIndex: "updated",
                width: 140,
                align: "center",
                renderer: Ext.util.Format.dateRenderer("d.m.Y H:i:s")
            },
            {
                flex : 1
            }
        ]
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить скрипт",
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
                tooltip : "Копировать",
                itemId: "btnCopy",
                disabled: true,
                iconCls: "icon-doc-copy",
                scope: this,
                handler: function () {
                    this.fireEvent("copybtnclick", this);
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
        this.down("#btnCopy").setDisabled(selCount != 1);
        this.down("#btnDelete").setDisabled(selCount < 1);
    },
    
    onChangeFilter: function (value) {
        this.getStore().addFilter("name", (value) ? {
            "$like": value
        } : null);
    }

});