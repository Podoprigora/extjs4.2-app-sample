Ext.define("App.view.bids.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsGridPanel",
    
    stateful: true,
    stateId: 'BidsGridPanel',
    
    config : {
        salesChannelsStore : null
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.BidsStore');
        this.salesChannelsStore = Ext.create('App.store.bids.directories.SalesChannelsStore', { autoLoad : true });
        
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        this.dockedItems = [
            this.buildTbar(),
            this.buildFilters()
        ];
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'acceptbtnclick', 'rejectbtnclick', 'editbtnclick', 'deletebtnclick', 'setfilter', 'togglefiltertype', 'showadvancedfilterparams');
        
        this.salesChannelsStore.on('load', function(){
            this.getView().refresh();
        }, this);
        
        this.on('selectionchange', this.onToggleBtns, this);
        this.on('afterrender', this.onInitHeaderSettingsMenu, this);
    },
    
    afterRender : function(){
        this.callParent(arguments);
        
        this.getView().getEl().on('scroll', function(e){
            this.doComponentLayout();
        }, this, {buffer : 500});
    },
    
    buildFeatures : function(){
        return [
            {
                ftype : 'rowbody',
                getAdditionalData : function(data, rowIndex, record, orig) {
                    var colspan = this.view.headerCt.getColumnCount();
                    
                    var statusStr = '<div class="column-field-status" data-qtip="Подтверждено">' + Ext.String.trim(record.get('status_name')) + '</div>';
                    if (record.get('priority') < 100 && record.get('status_state') == 1) {
                        statusStr = '<div class="column-field-status-accept" data-qtip="Подтверждено">' + Ext.String.trim(record.get('status_name'))+ '</div>';    
                    } else if (record.get('status_state') == 2) {
                        statusStr = '<div class="column-field-status-reject" data-qtip="Отклонено">' + Ext.String.trim(record.get('status_name')) + '</div>';    
                    }
                    
                    var waitStatusStr = "";
                    if (record.get('priority') == 100 && Ext.isEmpty(record.get('next_status_name')) == false) {
                        waitStatusStr = '<div class="column-field"><div class="column-field-label">Ожидает статус:</div>' +
                                '<div class="column-field-status-wait" data-qtip="Ожидает подтверждения">' + record.get('next_status_name') + '</div><br /></div>';
                    }
                    
                    return {
                        rowBody : 
                        '<div class="x-template-column-hbox">' +
                            '<div class="column-field">' +
                                '<div class="column-field-label">Текущий статус:</div>' +
                                statusStr +
                                '<div>&nbsp;' + Ext.String.trim(record.get('status_update_by_user')) + ", " + record.get('status_updated') +'</div> ' +
                            '</div>' +
                            waitStatusStr +
                            '<div class="column-field"><div class="column-field-label">Автор:</div>' + Ext.String.trim(record.get('user')) + ", " + record.get('created') + '</div>' +
                        '</div>',
                        rowBodyCls : 'x-grid-rowbody-template',
                        rowBodyColspan : colspan
                    };
                }
            },
            {
                ftype: 'rowwrap'
            }
        ];
    },
    
    buildColumns : function() {
        return [
            {
                header : '№ заявки',
                dataIndex : 'id',
                width : 80
            },
            {
                header : 'Код точки',
                dataIndex : 'shop_code',
                width : 100,
                renderer : this.tipRenderer
            },
            {
                header : 'Код терр.',
                dataIndex : 'area_code',
                width : 80,
                align : 'center'
            },
            {
                header : 'Город',
                dataIndex : 'shop_city',
                width : 140,
                renderer : this.tipRenderer
            },
            {
                header : 'Адрес',
                dataIndex : 'shop_address',
                width : 140,
                flex : 1,
                renderer : this.tipRenderer
            },
            {
                header : 'Наименование',
                dataIndex : 'shop_name',
                width : 140,
                flex : 1,
                renderer : this.tipRenderer
            },
            {
                header : 'Юр. лицо',
                dataIndex : 'shop_legal_name',
                width : 140,
                flex : 1,
                hidden : true,
                renderer : this.tipRenderer
            },
            {
                header : 'Канал сбыта',
                dataIndex : 'shop_rka',
                width : 120,
                flex : 1,
                hidden : true,
                renderer : this.channelRenderer
            }
        ];
    },
    
    buildTbar : function(){
        return {
            xtype : 'toolbar',
            dock : 'top',
            items : [
                {
                    text : 'Новая заявка',
                    iconCls : 'icon-create',
                    scope : this,
                    handler : function() {
                        this.fireEvent('createbtnclick', this);
                    }
                },
                
                {
                    text : 'Еще',
                    itemId : 'btnActions',
                    iconCls : 'icon-menu',
                    disabled : true,
                    menu : [
                        {
                            text : 'Подтвердить',
                            iconCls : 'icon-accept',
                            scope : this,
                            handler : function() {
                                this.fireEvent('acceptbtnclick', this);
                            }
                        },
                        {
                            text : 'Отклонить',
                            iconCls : 'icon-reject',
                            scope : this,
                            handler : function() {
                                this.fireEvent('rejectbtnclick', this);
                            }
                        },
                        '-',
                        {
                            text : "Редактировать",
                            iconCls : "icon-edit",
                            itemId : 'btnEdit',
                            scope : this,
                            handler : function() {
                                this.fireEvent("editbtnclick", this);
                            }
                        },
                        {
                            text : "Удалить",
                            iconCls : "icon-delete",
                            itemId : 'btnDelete',
                            scope : this,
                            handler : function() {
                                this.fireEvent("deletebtnclick", this);
                            }
                        }
                    ]
                },
                "->",
                {
                    xtype : 'button',
                    text : 'Тип фильтра',
                    iconCls : 'icon-filter',
                    menu : [
                        {
                            text : 'Стандартный',
                            group : 'bidsFiltersType',
                            checked : true,
                            checkHandler : Ext.bind(this.onToggleFiltersType, this, ['standart'], 2)
                        },
                        {
                            text : 'Расширенный',
                            group : 'bidsFiltersType',
                            checked : false,
                            checkHandler : Ext.bind(this.onToggleFiltersType, this, ['advanced'], 2)
                        }
                    ]
                },
                {
                    text : 'Выгрузить',
                    iconCls : 'icon-table-export',
                    menu : [
                        {
                            text : 'Обзор заявок',
                            iconCls : 'icon-table-export',
                            scope : this,
                            handler : function() {
                                this.fireEvent('exportbtnclick', this, 'all');
                            }
                        },
                        {
                            text : 'Отчет о выполнении',
                            iconCls : 'icon-table-export',
                            scope : this,
                            handler : function() {
                                this.fireEvent('exportbtnclick', this, 'performance_reports');
                            }
                        }
                    ]
                },
                {
                    tooltip : 'Настройка полей',
                    iconCls : 'icon-gear',
                    itemId : 'btnHeaderSettings',
                    menu : {
                        defaults : {
                            listeners : {
                                scope : this,
                                checkchange : this.onHeaderColumnCheckChange
                            }
                        },
                        items : []
                    }
                },
                {
                    tooltip : "Обновить",
                    iconCls : "icon-refresh",
                    scope : this,
                    handler : this.onRefresh
                }, 
                
                {
                    xtype : "component",
                    itemId : "Totals",
                    cls : "x-component-grid-text-item",
                    tpl : "Всего: <b>{count}</b>"
                }, 
                {
                    xtype : "tbspacer"
                }
            ]
        };
    },
    
    buildFilters : function() {
        return {
            xtype : 'form',
            dock : 'top',
            bodyCls : 'x-container-body-dark',
            height : 45,
            items : [
                {
                    xtype : 'fieldcontainer',
                    itemId : 'standartFilters',
                    layout : 'hbox',
                    items : [
                        {
                            xtype : 'uxFilterField',
                            name : 'date',
                            menuCls : 'App.ux.grid.header_filters.DateMenu',
                            emptyText : 'За все время',
                            width : 150,
                            margin : '10 0 0 10',
                            listeners : {
                                scope : this,
                                setfilter : function(field, value) {
                                    this.getStore().addFilter('date', (value) ? value : null);     
                                }
                            }
                        },
                        {
                            xtype : 'buttongroup',
                            margin : '8 0 0 10',
                            defaults : {
                                enableToogle : true,
                                toggleGroup : 'bidsFilter',
                                width : 95,
                                listeners : {
                                    scope : this,
                                    click : function(btn) {
                                        if (btn.pressed == false) {
                                            btn.toggle(true);
                                        } else {
                                            this.getStore().addFilter('type', btn.filterVal);      
                                        }
                                    }
                                }
                            },
                            items : [
                                {
                                    text : 'Ожидающие',
                                    filterVal : 'pending',
                                    margin : '0 0 0 -1'
                                },
                                {
                                    text : 'Собственные',
                                    filterVal : 'my',
                                    margin : '0 0 0 -2'
                                },
                                {
                                    text : 'Отклоненные',
                                    filterVal : 'reject',
                                    margin : '0 0 0 -2'
                                },
                                {
                                    text : 'Табель',
                                    iconCls : 'icon-checkmark',
                                    tooltip : 'Обзор выполненных заявок',
                                    filterVal : 'completed',
                                    margin : '0 0 0 -2'
                                },
                                {
                                    text : 'Все',
                                    filterVal : null,
                                    margin : '0 -1 0 -2',
                                    width : 60,
                                    pressed : true
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype  :'fieldcontainer',
                    itemId : 'advancedFilters',
                    layout : 'anchor',
                    hidden : true,
                    items : [
                        {
                            xtype : 'button',
                            cls : 'x-btn-link',
                            text : 'Показать параметры расширенного фильтра',
                            margin : '8 10 0 10',
                            scope : this,
                            handler : function() {
                                this.fireEvent('showadvancedfilterparams', this);
                            }
                        }
                    ]
                
                }
            ]
        };
    },
    
    onToggleFiltersType : function(btn, checked, type) {
        if (checked) {
            this.down('#standartFilters').setVisible(type == 'standart');
            this.down('#advancedFilters').setVisible(type == 'advanced');

            this.fireEvent('togglefiltertype', this, type);   
        }
    },
    
    onInitHeaderSettingsMenu : function(grid){
        var btnSetting = this.down('#btnHeaderSettings'),
            columns = this.headerCt.getGridColumns();
            
        for (var i in columns){
            if (Ext.isEmpty(columns[i].dataIndex) == false) {
                btnSetting.menu.add({
                    xtype: 'menucheckitem',
                    text : columns[i].text,
                    dataIndex : columns[i].dataIndex,
                    checked : columns[i].isVisible()
                }); 
            }
        }
    },
    
    onHeaderColumnCheckChange : function(checkItem, checked){
        var columns = this.headerCt.getGridColumns();
        for(var i in columns){
            
            if (columns[i].dataIndex == checkItem.dataIndex) {
                columns[i].setVisible(checked);
                break;
            }
        }
    },
    
    onToggleBtns : function() {
        var selected = this.getSelectionModel().getSelection(),
            isAuthor = true,
            isCompleted = false;
        
        Ext.Array.forEach(selected, function(item){
            if (item.get('user_id') != App.Identity.getRecord().get('id')) {
                isAuthor = false;      
            }
            if (item.get('completed') == 1) {
                isCompleted = true;    
            }
        });
        
        this.down('#btnActions').setDisabled(selected.length == 0 || isCompleted);
        this.down('#btnActions').down('#btnEdit').setDisabled(selected.length != 1);
        this.down('#btnActions').down('#btnDelete').setDisabled(isAuthor == false);
    },
    
    tipRenderer : function(v, metaData, record) {
        if (v.length) {
            metaData.tdAttr = Ext.String.format("data-qtip='{0}'", v);
        }
        return v;
    },
    
    channelRenderer : function(v) {
        if (this.getSalesChannelsStore().getCount()) {
            var channelRecord = this.getSalesChannelsStore().findRecord('code', v);
            return (channelRecord) ? channelRecord.get('name') : v;
        }
        return v;
    }
    
});