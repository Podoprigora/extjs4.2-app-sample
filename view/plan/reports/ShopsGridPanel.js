Ext.define("App.view.plan.reports.ShopsGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanReportShopsGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ReportShopsStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.dockedItems = [this.buildFiltersPanel()];
        
        this.callParent(arguments);
        
        this.addEvents("exportbtnclick", "viewbtnclick");
        
        this.getStore().on("load", this.onBeforeLoadStore, this);
        this.on("setfilter", this.onSetFilter, this);
        this.on("selectionchange", this.onToggleBtns, this);
    },
    
    buildColumns: function () {
        return [{
            header: "ID",
            dataIndex: "phone",
            width: 120,
            align: "center"
        }, {
            header: "Дата отчета",
            dataIndex: "date",
            width: 140,
            align: "center",
            renderer: Ext.util.Format.dateRenderer("d.m.Y")
        }, {
            header: "Отсутсвие товара мин.",
            dataIndex: "lack_minutes",
            width: 140,
            align: "center"
        }, 
        {
            header: "Код",
            dataIndex: "shop_code",
            width: 120,
            align: "center"
        },
        {
            header: "Наименование",
            dataIndex: "shop_name",
            minWidth: 160,
            maxWidth: 240,
            flex: 1,
            renderer: this.wraptextRenderer
        }, {
            header: "Адрес",
            dataIndex: "shop_address",
            minWidth: 160,
            maxWidth: 240,
            flex: 1,
            renderer: this.wraptextRenderer
        }, {
            header: "Оборудование",
            dataIndex: "equipment_name",
            minWidth: 160,
            maxWidth: 240,
            flex: 1,
            renderer: this.wraptextRenderer
        }, {
            header: "Выкладка",
            dataIndex: "planogram_name",
            minWidth: 160,
            maxWidth: 240,
            flex: 1,
            renderer: this.wraptextRenderer
        }];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Фильтры",
                itemId : 'btnFilter',
                iconCls: "icon-filter",
                enableToggle: true,
                scope: this,
                handler: function (btn) {
                    this.down("#frmFilters").setVisible(btn.pressed);
                }
            }, 
            {
                text: "Выгрузить",
                itemId: "btnExport",
                disabled: true,
                iconCls: "icon-table-export",
                scope: this,
                handler: function () {
                    this.fireEvent("exportbtnclick", this);
                }
            },
            {
                xtype: "tbspacer"
            },
            {
                text: "Подробная информация",
                itemId: "btnView",
                iconCls: "icon-view",
                disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("viewbtnclick", this);
                }
            }, 
            "->", 
            {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, 
            {
                xtype: "tbspacer"
            }, 
            {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, 
            {
                xtype: "tbspacer"
            }
        ]
    },
    
    buildFiltersPanel: function () {
        var a = this;
        return {
            xtype: "form",
            itemId: "frmFilters",
            hidden: true,
            width: 220,
            dock: "left",
            bodyCls: "x-container-body",
            cls: "x-plain-tb x-plain-rb",
            autoScroll: true,
            border: false,
            defaults: {
                anchor: "100%",
                labelAlign: "top"
            },
            items: [{
                xtype: "uxFilterField",
                menuCls: "App.view.plan.reports.GridFilterDateMenu",
                fieldLabel: "Дата",
                emptyText: "Выберите дату",
                margin: "5 10 5 10",
                listeners: {
                    scope: this,
                    setfilter: function (field, value) {
                        this.fireEvent("setfilter", this, {
                            property: "date",
                            value: value
                        });
                    }
                }
            },
            {
                xtype: "hidden",
                name: "shop_id",
                listeners: {
                    scope: this,
                    change: function (field, value) {
                        this.fireEvent("setfilter", this, {
                            property: "shop_id",
                            value: value
                        });
                    }
                }
            },
            {
                xtype: "PlanShopsListField",
                fieldLabel: "Торговая точка",
                emptyText: "Выберите торговую точку",
                margin: "5 10 5 10",
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        field.setValue(Ext.String.format("{0}, {1}", record.get("phone"), record.get("name")));
                        field.previousSibling("hidden[name=shop_id]").setValue(record.get("id"));
                    },
                    clearfield: function (field) {
                        field.previousSibling("hidden[name=shop_id]").reset();
                    }
                }
            },
            {
                xtype: "hidden",
                name: "equipment_id",
                listeners: {
                    scope: this,
                    change: function (field, value) {
                        this.fireEvent("setfilter", this, {
                            property: "equipment_id",
                            value: value
                        });
                    }
                }
            },
            {
                xtype: "PlanEquipmentsListField",
                fieldLabel: "Оборудование",
                emptyText: "Выберите оборудование",
                margin: "5 10 5 10",
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        field.setValue(record.get("name"));
                        field.previousSibling("hidden[name=equipment_id]").setValue(record.get("id"));
                    },
                    clearfield: function (field) {
                        field.previousSibling("hidden[name=equipment_id]").reset();
                    }
                }
            },
            {
                xtype: "hidden",
                name: "planogram_id",
                listeners: {
                    scope: this,
                    change: function (field, value) {
                        this.fireEvent("setfilter", this, {
                            property: "planogram_id",
                            value: value
                        });
                    }
                }
            },
            {
                xtype: "PlanogramsListField",
                fieldLabel: "Выкладка",
                emptyText: "Выберите выкладку",
                margin: "5 10 5 10",
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        field.setValue(record.get("name"));
                        field.previousSibling("hidden[name=planogram_id]").setValue(record.get("id"));
                    },
                    clearfield: function (field) {
                        field.previousSibling("hidden[name=planogram_id]").reset();
                    }
                }
            }]
        }
    },
    
    onSetFilter: function (grid, filter) {
        this.getStore().addFilter(filter.property, filter.value);
    },
    
    onBeforeLoadStore: function (store) {
        var dateFilter = store.getFilterByKey('date');
        if (Ext.isEmpty(dateFilter) == false && Ext.isEmpty(dateFilter.value.mode) == false) {
            this.columns[1].hide();
        } else {
            this.columns[1].show();  
        }

        this.down("#btnExport").setDisabled(!store.getCount());
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        this.down("#btnView").setDisabled(selCount != 1);
    }
});