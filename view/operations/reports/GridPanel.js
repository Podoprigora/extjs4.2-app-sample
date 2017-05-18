Ext.define("App.view.operations.reports.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.OperationsReportGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.OperationsReportStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        this.dockedItems = [
            this.buildFiltersPanel()
        ];
        
        this.viewConfig = Ext.apply({ disableSelection : true}, this.viewConfig);
        this.ctxMenu = this.buildCtxMenu();
        
        this.callParent(arguments);
        
        this.addEvents('setfilter', 'editbtnclick', 'changeslogsbtnclick', 'exportbtnclick');
        
        this.on('groupcontextmenu', this.onShowCtxMenu, this);
        this.getStore().on('load', this.onBeforeLoadStore, this);
    },
    
    buildFeatures : function() {
        return [{
            ftype : 'grouping',
            groupHeaderTpl : '<a href="javaScript:void(0)" title="Открыть" class="icon-view">{name}</a>',
            hideGroupedHeader : true
        }];
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="type == \'incoming\'">' +
                        '<div class="col-icon icon-checkmark" title="Принято">&nbsp;</div>' +
                    '<tpl elseif="type == \'issue\'">' +
                        '<div class="col-icon icon-reply" title="Отпущено">&nbsp;</div>' +
                    '<tpl elseif="type ==\'return\'">' +
                        '<div class="col-icon icon-remove" title="Возвращено">&nbsp;</div>' +
                    '<tpl elseif="type ==\'issue-transit\'">' +
                        '<div class="col-icon icon-truck" title="Выпущено в транзит">&nbsp;</div>' +
                    '<tpl elseif="type ==\'incoming-transit\'">' +
                        '<div class="col-icon icon-truck-green" title="Принято из транзита">&nbsp;</div>' +
                    '<tpl elseif="type ==\'cancel\'">' +
                        '<div class="col-icon icon-cancel" title="Списано">&nbsp;</div>' +
                    '</tpl>'
                ]
            },
            {
                header : '#',
                dataIndex : 'code',
                align : 'center',
                width : 100,
                sortable: true
            },
            {
                header : 'Партия',
                dataIndex : 'm_batch',
                width : 100,
                align : 'center'
            },
            {
                header : 'Код',
                dataIndex : 'm_code',
                align : 'center',
                width : 100
            },
            {
                header : 'Наименование',
                dataIndex : 'm_name',
                flex : 1,
                minWidth : 300,
                maxWidth : 550
            },
            {
                header : 'Кол-во',
                dataIndex : 'm_qty',
                tdCls : 'x-mark-rows',
                width : 80,
                align : 'center'
            },
            {
                header : 'Цена, руб.',
                dataIndex : 'm_price',
                width : 100,
                align : 'right',
                renderer : Ext.util.Format.numberRenderer('0,0.00')
            },
            {
                header : 'Сумма, руб.',
                dataIndex : 'm_amount',
                width : 120,
                align : 'right',
                sortable : false,
                renderer : Ext.util.Format.numberRenderer('0,0.00')
            },
            {
                header : '',
                minWidth : 5,
                flex : 1
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
        
        var me = this;
        
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
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'uxFilterField',
                    name : 'date',
                    menuCls : 'App.ux.grid.header_filters.DateMenu',
                    fieldLabel : 'Дата',
                    labelAlign : 'top',
                    emptyText : 'Выберите дату',
                    margin : '5 10 5 10',
                    listeners : {
                        scope : this,
                        setfilter : function(field, value) {
                            this.fireEvent('setfilter', this, {property : 'date', value : value});       
                        }
                    }
                },
                {
                    xtype : 'uxFilterTree',
                    itemId : 'typesFilter',
                    title : 'Тип',
                    store : Ext.create('App.store.operations.TypesLocalStore'),
                    autoHeight : true,
                    border : false,
                    margin : 5,
                    listeners : {
                        scope : this,
                        checkchange : function(node, checked){
                            var form = this.down('frmFilters'),
                                filter = this.down('#typesFilter'),
                                ids = App.ux.util.Format.convertRecordsToIdsArray(filter.getChecked());
                            if (ids.length) {
                                this.fireEvent('setfilter', this, {property : 'type', value : {'$in' : ids}});
                            } else {
                                this.fireEvent('setfilter', this, {property : 'type', value : null});
                            }
                        }
                    }
                },
                {
                    xtype : 'LocationsFilterPanel',
                    //hidden : App.Identity.getRecord().isStorekeeper(),
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
                },
                {
                    xtype : 'uxFilterField',
                    name : 'document',
                    fieldLabel : 'Документ',
                    labelAlign : 'top',
                    editable : true,
                    margin : '0 10 5 10',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'document', value : ((value) ? {'$like' : value} : null)});    
                        }
                    }
                }
            ]
        };
    },
    
    buildCtxMenu : function() {
        return Ext.create('Ext.menu.Menu', {
            items : [
                {
                    text : 'Редактировать',
                    iconCls : 'icon-edit',
                    scope : this,
                    handler : function() {
                        this.fireEvent('editbtnclick', this);
                    }
                },
                '-',
                {
                    text : 'История изменений',
                    iconCls : 'icon-history',
                    scope : this,
                    handler : function() {
                        this.fireEvent('changeslogsbtnclick', this);
                    }
                }
            ]
        });
    },
    
    onShowCtxMenu : function(view, node, group, e) {
        e.stopEvent();
        this.ctxMenu.params = {e: e, group : group};
        this.ctxMenu.showAt(e.getXY());
    },
    
    onBeforeLoadStore : function(store) {
        this.down('#btnExport').setDisabled(! store.getCount());
    }
    
});