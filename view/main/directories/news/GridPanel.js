Ext.define("App.view.main.directories.news.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainDirectoryNewsGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.NewsStore');
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        
        this.callParent(arguments);
        
        this.on('selectionchange', this.onToggleBtns, this);
    },
    
    buildColumns : function(){
        return [
            {
                header : 'Дата',
                dataIndex : 'date',
                width : 80,
                tdCls : 'x-mark-rows',
                renderer : Ext.util.Format.dateRenderer('d.m.Y')
            },
            {
                header : 'Заголовок',
                dataIndex : 'title',
                tdCls : 'x-mark-rows x-cell-root',
                flex : 1
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                width : 180,
                tdCls : 'x-mark-rows',
                renderer : function(v){
                    return (Ext.isEmpty(v)) ? '[Все регионы]' : v;
                }
            }
        ];
    },
    
    buildFeatures : function(){
        return [
            {
                ftype : 'rowbody',
                getAdditionalData : function(data, rowIndex, record){
                    var colspan = this.view.headerCt.getColumnCount();
                    return {
                        rowBody : record.get('preview'),
                        rowBodyCls : 'x-grid-rowbody-message-ml',
                        rowBodyColspan : colspan
                    };
                }
            },
            {
                ftype : 'rowwrap'
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
                xtype : "uxFilterField",
                fieldLabel : "Поиск",
                labelAlign : "right",
                labelWidth : 60,
                width : 250,
                emptyText : "Введите заголовок или анонс",
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