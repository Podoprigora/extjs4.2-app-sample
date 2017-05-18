Ext.define("App.view.operations.directories.storekeepers.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryStorekeepersGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.operations.directories.StorekeepersStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.dockedItems = [
            this.buildFiltersPanel()
        ];
        
        this.callParent(arguments);
        
        this.addEvents('setfilter');
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 25,
                align : 'center',
                dataIndex : 'is_active',
                items : [
                    {
                        getClass : this.getActiveColumnClass
                    }
                ]
            },
            {
                header : 'ФИО',
                dataIndex : 'fio',
                minWidth : 140,
                flex : 1
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                width : 200
            },
            {
                header : 'Склады',
                dataIndex : 'warehouses_list',
                sortable : false,
                flex : 1,
                minWidth : 160,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Телефон',
                dataIndex : 'phones',
                width : 160,
                sortable : false,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Email',
                dataIndex : 'email',
                width : 160,
                sortable : false
            },
            {
                header : 'Адрес',
                dataIndex : 'address',
                width : 200,
                sortable : false
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
            width : 220,
            autoScroll : true,
            border : false,
            defaults : {
                anchor : '100%'
            },
            items : [
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
                    fieldLabel : 'ФИО',
                    labelAlign : 'top',
                    margin : '0 10 5 10',
                    editable : true,
                    emptyText : 'Введите ФИО',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'fio', value : ((value) ? {'$like' : value} : null)});       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Телефон',
                    labelAlign : 'top',
                    margin : '0 10 5 10',
                    editable : true,
                    emptyText : 'Введите телефон',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'phone', value : ((value) ? {'$like' : value} : null)});       
                        }
                    }
                },
                {
                    xtype : 'uxFilterField',
                    fieldLabel : 'Email',
                    labelAlign : 'top',
                    margin : '0 10 5 10',
                    editable : true,
                    emptyText : 'Введите Email',
                    listeners : {
                        scope : this,
                        search : function(value) {
                            this.fireEvent('setfilter', this, {property : 'email', value : ((value) ? {'$like' : value} : null)});       
                        }
                    }
                }
            ]
        };
    },
    
    getActiveColumnClass : function(v, metaData, record) {
        if (! v) {
            metaData.tdAttr = 'data-qtip="Заблокирован"';
            return 'icon-lock';
        } else {
            metaData.tdAttr = 'data-qtip="Активный"';
            return 'icon-accept';    
        }
    }
    
});