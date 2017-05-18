Ext.define("App.view.plan.smslog.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.PlanSmsLogGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.plan.SmsLogStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.dockedItems = [
            this.buildFilters()
        ];
        this.features = this.buildFeatures();
        this.plugins = this.buildPlugins();
        this.cls += " x-no-dirty";
        
        this.callParent(arguments);
        
        this.addEvents('setfilter');
        
        this.on('setfilter', this.onSetFilter, this);
    },
    
    buildFeatures : function() {
        return [{
            ftype : 'grouping',
            groupHeaderTpl : "{name}"
        }];
    },
    
    buildPlugins : function(){
        return [
            {
                ptype : 'cellediting',
                clicksToEdit : 1
            }
        ];
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Дата / Время',
                dataIndex : 'time',
                width : 100,
                align : 'center',
                sortable : false
            },
            {
                header : 'Тип',
                dataIndex : 'type',
                width : 60,
                align : 'center',
                sortable : false
            },
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="this.isValid(values) == false">',
                        '<div class="{[this.getIconCls(values)]}" data-qtip="{[this.getAlerts(values)]}">&nbsp;</div>',
                    '</tpl>',
                    {
                        isValid : function(values) {
                            if (values.is_low_balance == 1) {
                                return false;
                            } else if(Ext.String.trim(values.message).toLowerCase() == 'power off') {
                                
                                return false;    
                            }
                            return true;
                        },
                        getIconCls : function(values){
                            if (values.is_low_balance == 1) {
                                return "icon-attach-money";
                            } else if(Ext.String.trim(values.message).toLowerCase() == 'power off') {
                                return "icon-power-cord";    
                            }    
                        },
                        getAlerts : function(values) {
                            if (values.is_low_balance == 1) {
                                return "Низкий баланс SIM карты";
                            } else if(Ext.String.trim(values.message).toLowerCase() == 'power off') {
                                return "Отключение электричества";    
                            }
                        }
                    }
                ]
            },
            {
                header : 'Логин',
                dataIndex : 'phone',
                width : 100,
                align : 'center',
                sortable : false
            },
            {
                header : 'Торговая точка',
                width : 300,
                renderer : function(v, metaData, record){
                    if (Ext.isEmpty(record.get('phone')) || Ext.isEmpty(record.get('shop_name'))) {
                        return '<div class="x-cell-red">[Не найдена]</div>';
                    } else {
                        return [record.get('shop_name'), record.get('shop_address')].join(", ");    
                    }
                }
            },
            
            {
                header : 'Сообщение',
                dataIndex : 'message',
                flex : 1,
                editor : {
                    xtype : 'textfield'
                },
                renderer : this.qtipRenderer
            }
        ];
    },
    
    buildTbar : function() {
         return [
            {
                text : 'Фильтры',
                iconCls : 'icon-filter',
                enableToggle : true,
                scope : this,
                handler : function(btn) {
                    var filterPanel = this.down('#frmFilters');
                    filterPanel.setVisible(btn.pressed);
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
    
    buildFilters : function() {
        return {
            xtype : 'form',
            itemId : 'frmFilters',
            hidden : true,
            width : 220,
            dock : 'left',
            bodyCls : 'x-container-body',
            cls : 'x-plain-tb x-plain-rb',
            autoScroll : true,
            border : false,
            defaults : {
                labelAlign : 'top',
                anchor : '100%'
            },
            items : [
                {
                    xtype: "uxFilterField",
                    menuCls: "App.ux.grid.header_filters.DateMenu",
                    fieldLabel : 'Дата',
                    emptyText: "Выберите дату",
                    margin : '5 10 5 10',
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
                    xtype : 'uxFilterField',
                    fieldLabel : 'Логин',
                    emptyText : 'Введите логин / телефон',
                    margin : '0 10 5 10',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'phone', value : ((value) ? {'$like' : value} : null)});       
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
                    fieldLabel : 'Торговая точка',
                    emptyText: "Выберите торговую точку",
                    margin : '0 10 5 10',
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
                    xtype : 'checkboxfield',
                    boxLabel : 'Торговая точка не найдена',
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        change : function(field, value){
                            this.fireEvent('setfilter', this, {property : 'shop_is_null', value : (value) ? value : null}); 
                        }
                    }
                },
                {
                    xtype : 'uxCombo',
                    fieldLabel : 'Тип',
                    name : 'type',
                    store : Ext.create('Ext.data.Store',{
                        fields : ['id', 'name'],
                        data : [
                            {
                                id : 'sms',
                                name : 'SMS'
                            },
                            {
                                id : 'gprs',
                                name : 'GPRS'
                            }
                        ],
                        proxy : {
                            type : 'memory',
                            reader : {
                                type  :'json'
                            }
                        }
                    }),
                    enableReset : true,
                    editable : false,
                    emptyText : 'Выберите тип',
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        change : function(field, value){
                            this.fireEvent("setfilter", this, {
                                property: "type",
                                value: value
                            });   
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Сообщение',
                    margin : '0 10 5 10',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'message', value : ((value) ? {'$like' : value} : null)});       
                        }
                    }
                }
            ]
        };
    },
    
    onSetFilter: function (grid, filter) {
        this.getStore().addFilter(filter.property, filter.value);
    }
});