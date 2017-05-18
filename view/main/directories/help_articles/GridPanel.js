Ext.define("App.view.main.directories.help_articles.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainDirectoryHelpArticlesGridPanel",
    
    selModel : {
        selType : 'checkboxmodel'
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.HelpArticlesStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.on('selectionchange', this.onToggleBtns, this);
    },
    
    buildColumns : function(){
        return [
            {
                header : 'Группа / Заголовок',
                dataIndex : 'title',
                flex : 1
            },
            {
                header : 'Порядок',
                dataIndex : 'priority',
                align : 'center',
                tdCls : 'x-mark-rows',
                width : 80
            },
            {
                xtype : 'templatecolumn',
                header : 'Показывать на рабочем столе',
                align : 'center',
                width : 120,
                tpl : [
                    '<tpl if="is_visible_on_dashboard == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                flex : 1
            }
        ];
    },
    
    buildFeatures : function(){
        return [
            {
                ftype : 'grouping',
                groupHeaderTpl : '{name}',
                hideGroupedHeader : true
            }
        ];
    },
    
    buildTbar : function(){
        return [
            {
                text : "Добавить",
                iconCls : "icon-create",
                scope : this,
                handler : function() {
                    this.fireEvent("createbtnclick", this);
                }
            },
            {
                tooltip : 'Редактировать',
                itemId : 'btnEdit',
                iconCls : 'icon-edit',
                disabled : true,
                scope : this,
                handler : function() {
                    this.fireEvent('editbtnclick', this);
                }
            },
            {
                text : 'Действия',
                itemId : 'btnActions',
                disabled : true,
                iconCls : 'icon-menu',
                menu : [
                    {
                        text : 'Добавить на рабочий стол',
                        scope : this,
                        handler : function() {
                            this.fireEvent('changedashboardvisibilitybtnclick', this, 1);
                        }
                    },
                    {
                        text : 'Удалить с рабочего стола',
                        scope : this,
                        handler : function() {
                            this.fireEvent('changedashboardvisibilitybtnclick', this, 0);
                        }
                    },
                    '-',
                    {
                        text : 'Переместить в архив',
                        itemId : 'btnHide',
                        scope : this,
                        handler : function() {
                            this.fireEvent('changevisibilitybtnclick', this, 0);
                        }
                    },
                    {
                        text : 'Восстановить из архива',
                        itemId : 'btnShow',
                        disabled : true,
                        scope : this,
                        handler : function() {
                            this.fireEvent('changevisibilitybtnclick', this, 1);
                        }
                    },
                    '-',
                    {
                        text : "Удалить",
                        iconCls : "icon-delete",
                        scope : this,
                        handler : function() {
                            this.fireEvent("deletebtnclick", this);
                        }
                    }
                ]
            },
            {
                text : 'Группы',
                iconCls : 'icon-app-table',
                scope : this,
                handler : function(){
                    this.fireEvent('showgroupbtnclick', this);
                }
            },
            {
                xtype : "uxFilterField",
                fieldLabel : "Поиск",
                labelAlign : "right",
                labelWidth : 60,
                width : 250,
                emptyText : "поиск по основным полям",
                editable : true,
                listeners : {
                    scope : this,
                    search : this.onChangeFilter
                }
            },
            {
                xtype : "tbspacer"
            },
            {
                xtype : 'buttongroup',
                defaults : {
                    enableToogle : true,
                    toggleGroup : 'planGoodsFilter',
                    listeners : {
                        scope : this,
                        click : function(btn) {
                            if (btn.pressed == false) {
                                btn.toggle(true);
                            } else {
                                this.onSetVisibleFilter(btn.filterValue);   
                            }
                        }
                    }
                },
                items : [
                    {
                        text : 'Активные',
                        filterValue : 1,
                        pressed : true
                    },
                    {
                        text : 'Архив',
                        filterValue : 0,
                        margin : '0 0 0 -2'
                    }
                ]
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
    
    onToggleBtns : function() {
        var selCount = this.getView().getSelectionModel().getCount();
        this.down("#btnActions").setDisabled(selCount < 1);
        this.down("#btnEdit").setDisabled(selCount != 1);
    },
    
    onSetVisibleFilter : function(value) {
        this.down('#btnShow').setDisabled(value == 1);
        this.down('#btnHide').setDisabled(value == 0);
        this.getStore().addFilter("is_active", value); 
    },

    onChangeFilter : function(value) {
        this.getStore().addFilter("query", (value) ? {
            "$like" : value
        } : null);
    }
    
});