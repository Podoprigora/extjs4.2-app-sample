Ext.define("App.view.settings.users.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.UsersGridPanel",
    
    selModel : {
        selType : 'checkboxmodel'
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.users.UsersStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'editbtnclick', 'deletebtnclick', 'filtersbtnclick', 'changetbarfilter', 'setfilter');
        
        this.on('selectionchange', this.onToggleBtns, this);
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="is_active == 1">' +
                        '<div class="col-icon icon-account-circle-green" title="Активирован">&nbsp;</div>' +
                    '<tpl elseif="is_active == 2">' +
                        '<div class="col-icon icon-schedule" title="Ожидает активации">&nbsp;</div>' +
                    '<tpl else>' +
                        '<div class="col-icon icon-account-circle-red" title="Заблокирован">&nbsp;</div>' +
                    '</tpl>']
            },
            {
                header : 'ФИО',
                dataIndex : 'fio',
                minWidth : 140,
                maxWidth : 250,
                flex : 1,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Роль',
                dataIndex : 'role',
                minWidth : 140,
                flex : 1,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Регион',
                dataIndex : 'region',
                minWidth : 140,
                flex : 1,
                renderer : this.wraptextRenderer
            },
            {
                header : 'Последний вход',
                dataIndex : 'login_date',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            },
            {
                header : 'IP',
                dataIndex : 'login_ip',
                width : 140,
                align : 'center',
                sortable : false
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Добавить',
                iconCls : 'icon-create',
                scope : this,
                handler : function() {
                    this.fireEvent('createbtnclick', this);
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
                tooltip : 'Удалить',
                itemId : 'btnDelete',
                disabled : true,
                iconCls : 'icon-delete',
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);
                }
            },
            {
                text : 'Действия',
                itemId : 'btnAction',
                iconCls : 'icon-menu',
                disabled : true,
                menu : [
                    {
                        text : 'Заблокировать',
                        scope : this,
                        handler : function() {
                            this.fireEvent('lockbtnclick', this);
                        }
                    }/*,
                    {
                        text : 'Активировать',
                        scope : this,
                        handler : function() {
                            this.fireEvent('restorebtnclick', this);
                        }
                    }*/
                ]
            },
            {
                text : 'Фильтры',
                itemId : 'btnFilter',
                iconCls : 'icon-filter',
                enableToggle : true,
                scope : this,
                handler : function(btn) {
                    this.fireEvent('filtersbtnclick', btn);
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
    
    onToggleBtns : function() {
        var selCount = this.getSelectionModel().getCount();
        
        this.down('#btnEdit').setDisabled(selCount != 1);
        this.down('#btnDelete').setDisabled(! selCount);
        this.down('#btnAction').setDisabled(! selCount);
    }
    
});