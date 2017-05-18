Ext.define("App.view.main.directories.sliders.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.MainDirectorySlidersGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.main.directories.SlidersStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        
        this.callParent(arguments);
        
        this.on('selectionchange', this.onToggleBtns, this);
    },
    
    buildColumns : function(){
        return [
            {
                header : 'Наименование',
                dataIndex : 'name',
                width : 250
            },
            {
                header : 'Порядок',
                dataIndex : 'priority',
                width : 80,
                align : 'center',
                tdCls : 'x-mark-rows'
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                flex : 1,
                renderer : function(v){
                    return (Ext.isEmpty(v)) ? '[Все регионы]' : v;
                }
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
    }
    
});