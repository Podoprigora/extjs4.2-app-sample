Ext.define("App.view.plan.reports.LackOfGoodsGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanReportLackOfGoodsGridPanel",
    
    disableSelection: true,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ReportLackOfGoodsStore");
        this.columns = this.buildColumns();
        this.features = this.buildFeateres();
        this.tbar = this.buildTbar();
        this.dockedItems = [this.buildFiltersPanel()];
        
        this.callParent(arguments);
        
        this.addEvents("exportbtnclick", 'loadstore');
        
        this.getStore().on("load", this.onBeforeLoadStore, this);
        this.on("setfilter", this.onSetFilter, this);
    },
    
    buildFeateres: function () {
        return [{
            ftype: "grouping",
            groupHeaderTpl: '<a href="javaScript:void(0)" title="Открыть" class="icon-view">{name}</a>',
            hideGroupedHeader: true
        }];
    },
    
    buildColumns: function () {
        return [
            {
                header: "Товар",
                dataIndex: "goods_name",
                width : 240
            },  
            {
                header: "Отсутствие товара мин.",
                dataIndex: "lack_minutes",
                width: 160,
                align: "center"
            }, 
            {
                flex: 1
            }
        ];
    },
    
    buildTbar: function () {
        return [{
            text: "Фильтры",
            iconCls: "icon-filter",
            itemId : 'btnFilter',
            enableToggle: true,
            scope: this,
            handler: function (btn) {
                this.down("#frmFilters").setVisible(btn.pressed);
            }
        }, {
            text: "Выгрузить",
            itemId: "btnExport",
            disabled: true,
            iconCls: "icon-table-export",
            scope: this,
            handler: function () {
                this.fireEvent("exportbtnclick", this);
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
        }];
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
            items: [
                {
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
                },
                {
                    xtype: "hidden",
                    name: "goods_id",
                    listeners: {
                        scope: this,
                        change: function (field, value) {
                            this.fireEvent("setfilter", this, {
                                property: "goods_id",
                                value: value
                            });
                        }
                    }
                },
                {
                    xtype: "PlanGoodsListField",
                    fieldLabel: "Товар",
                    emptyText: "Выберите товар",
                    margin: "5 10 5 10",
                    listeners: {
                        scope: this,
                        select: function (field, record) {
                            field.setValue(record.get("name"));
                            field.previousSibling("hidden[name=goods_id]").setValue(record.get("id"));
                        },
                        clearfield: function (field) {
                            field.previousSibling("hidden[name=goods_id]").reset();
                        }
                    }
                },
                {
                    xtype : 'fieldcontainer',
                    margin: "10 0 5 10",
                    defaults : {
                        listeners : {
                            scope : this,
                            change : function(field, value) {
                                if (value) {
                                    this.fireEvent("setfilter", this, {
                                        property: "view_type",
                                        value: field.filterValue
                                    }); 
                                }
                                
                            }
                        }
                    },
                    items : [
                        {
                            xtype : 'radiofield',
                            name : 'view_type',
                            filterValue : 'shop',
                            boxLabel : 'OOS на уровне магазина'
                        },
                        {
                            xtype  :'radiofield',
                            name : 'view_type',
                            boxLabel : 'OOS на уровне выкладки',
                            filterValue : 'equipment',
                            checked : true
                        }
                    ]
                }
            ]
        }
    },
    
    onSetFilter: function (grid, filter) {
        this.getStore().addFilter(filter.property, filter.value);
    },
    
    onBeforeLoadStore: function (store) {
        this.down("#btnExport").setDisabled(!store.getCount());
        this.fireEvent('loadstore', this, store);
    }
});