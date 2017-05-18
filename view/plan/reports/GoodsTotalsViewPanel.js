Ext.define("App.view.plan.reports.GoodsTotalsViewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.PlanReportGoodsViewPanel",
    
    config : {
        store : null,
        view : null
    },
    
    autoScroll : true,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ReportGoodsTotalsStore");
        this.view = this.buildView();
        this.items = this.getView();
        this.tbar = this.buildTbar();
        this.dockedItems = [this.buildFiltersPanel()];
        
        this.callParent(arguments);
        
        this.getView().on("refresh", this.onUpdateTotalQtyLabel, this);
        this.on("setfilter", this.onSetFilter, this);
    },
    
    buildView : function() {
        return Ext.create("Ext.view.View", {
            store : this.getStore(),
            tpl : [
                    '<tpl for=".">',
                        '<div class="thumb-wrap" id="{goods_id}" style="width:80px; height:180px;">',
                            '<div class="thumb">',
                                '<div class="label-top"><div class="label-top-counter">{lack_minutes}</div></div>', 
                                '<img src="{goods_image}">',
                                '<div class="label" title="{goods_name}">{goods_name}</div>',
                            "</div>", 
                        "</div>", 
                    "</tpl>", 
                    '<div class="x-clear"></div>'
            ],
            disableSelection : true,
            trackOver : true,
            cls : 'x-view-images',
            overItemCls : "x-item-over",
            itemSelector : "div.thumb-wrap",
            emptyText : '<p class="x-view-empty">Нет данных</p>'
        }, this);
    },
    
    /*buildTpl: function () {
        return [
            '<tpl for=".">',  
                '<div class="x-column">', 
                '<div class="x-column-wrap">', 
                    '<div class="label-top"><h5>{lack_minutes}</h5></div>', 
                    '<img src="{goods_image}" data-qtip="{goods_name}">', 
                "</div>", 
                "</div>",  
            "</tpl>", 
            '<div class="x-clear"></div>'
        ];
    },
    
    buildView: function () {
        var tpl = this.buildTpl();
        return Ext.create("Ext.view.View", {
            itemId: "dataView",
            store: this.getStore(),
            tpl: tpl,
            prepareData: this.onViewPrepareData,
            trackOver: true,
            overItemCls: "x-column-over",
            itemSelector: ".x-column",
            cls: "x-block-items-view"
        }, this);
    },*/
    
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
        ];
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
                menuCls: "App.ux.grid.header_filters.DateMenu",
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
                }
            ]
        }
    },
    
    onViewPrepareData: function (data) {
        
        return data;
    },
    
    onSetFilter: function (grid, filter) {
        this.getStore().addFilter(filter.property, filter.value);
    },
    
    onRefresh : function() {
        this.getStore().load();
    },
    
    onUpdateTotalQtyLabel : function() {
        var tLabel = this.down("#Totals");
        if (Ext.isEmpty(tLabel) == false) {
            var count = this.getStore().getTotalCount();
            tLabel.update({
                count : (count ? count : this.getStore().getCount())
            });
        }
    }
});