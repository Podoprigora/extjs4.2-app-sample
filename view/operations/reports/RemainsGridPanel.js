Ext.define("App.view.operations.reports.RemainsGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.OperationsRemainsReportGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.RemainsReportStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.dockedItems = [this.buildFiltersPanel()];
        
        this.callParent(arguments);
        
        this.addEvents('setfilter', 'exportbtnclick');
        
        this.getStore().on('load', this.onBeforeLoadStore, this);
    },
    
    buildColumns : function() {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 80,
                align : 'center'
            },
            {
                header : 'Партия',
                dataIndex : 'batch',
                width : 80,
                align : 'center'
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                flex : 1,
                minWidth : 250,
                maxWidth : 550
            },
            {
                header : 'Кол-во',
                dataIndex : 'available_qty',
                width : 80,
                tdCls : 'x-mark-rows',
                align : 'center',
                renderer : function(v, meta, record) {
                    if (v < 0) {
                        meta.tdCls = "x-cell-red x-cell-bold ";
                    }
                    return v;
                }
            },
            {
                header : 'Цена',
                dataIndex : 'price',
                width : 100,
                align : 'right',
                renderer : Ext.util.Format.numberRenderer('0,0.00')
            },
            {
                header : '№ склада',
                dataIndex : 'w_code',
                width : 80,
                align : 'center'
            },
            {
                header : 'Наименование склада',
                dataIndex : 'w_name',
                width : 150
            },
            {
                header : 'Регион',
                dataIndex : 'w_region',
                minWidth : 120,
                flex : 1
            },
            {
                header : 'Дата изменения',
                dataIndex : 'updated',
                align : 'center',
                width : 120,
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i')
            },
            {
                header : 'Пользователь',
                dataIndex : 'user',
                width : 140
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
            {
                text : 'Выгрузить',
                itemId : 'btnExport',
                //hidden : App.Identity.getRecord().isStorekeeper(),
                disabled : true,
                iconCls : 'icon-table-export',
                scope : this,
                handler : function() {
                    this.fireEvent('exportbtnclick', this);   
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
            },
            {
                xtype : 'tbspacer'
            },
            { 
                xtype : 'component',
                itemId : 'Totals',
                cls : 'x-component-grid-text-item',
                tpl : 'Всего: <b>{count}</b>'
            }, 
            {
                xtype : 'tbspacer'
            }
        ];
    },
    
    buildFiltersPanel : function() {
        return {
            xtype : 'form',
            itemId : 'frmFilters',
            hidden : true,
            dock : 'left',
            bodyCls : 'x-container-body',
            cls : 'x-plain-tb x-plain-rb',
            border : false,
            autoScroll : true,
            width : 220,
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'uxFilterField',
                    menuCls : 'App.ux.grid.header_filters.DateMenu',
                    name : 'date',
                    fieldLabel : 'Дата',
                    labelAlign : 'top',
                    emptyText : 'Выберите дату',
                    margin : '5 10 5 10',
                    listeners : {
                        scope : this,
                        setfilter : function(field, value) {
                            this.fireEvent('setfilter', this, {property : 'updated', value : value});       
                        }
                    }
                },
                {
                    xtype : 'LocationsFilterPanel',
                    listeners : {
                        scope : this,
                        setfilter : function(form, filters) {
                            this.fireEvent('setfilter', this, filters);
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    name : 'code',
                    fieldLabel : 'Код',
                    emptyText : 'Введите код материала',
                    labelAlign : 'top',
                    margin : '0 10 5 10',
                    editable : true,
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'code', value : ((value) ? {'$like' : value} : null)});       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    name : 'batch',
                    fieldLabel : 'Партия',
                    emptyText : 'Введите код партии',
                    labelAlign : 'top',
                    editable : true,
                    multiSelect : true,
                    enableReset : true,
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'batch', value : ((value) ? {'$like' : value} : null)});    
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    name : 'material_name',
                    fieldLabel : 'Наименование',
                    emptyText : 'Введите наименование товара',
                    labelAlign : 'top',
                    editable : true,
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'material_name', value : ((value) ? {'$like' : value} : null)});    
                        }
                    }
                }
            ]
        };
    },
    
    onBeforeLoadStore : function(store) {
        this.down('#btnExport').setDisabled(! store.getCount());
    }
    
});