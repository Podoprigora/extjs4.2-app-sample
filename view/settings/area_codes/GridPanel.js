Ext.define("App.view.settings.area_codes.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.AreaCodesGridPanel",
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.area_codes.CodesStore');
        this.selModel = Ext.create('Ext.selection.CheckboxModel');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.cls += " hidden-actions-icon";
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'deletebtnclick');
        
        this.on('selectionchange', this.onToggleBtns, this);
        this.on('cellclick', this.onClickUserColumn, this);
    },
    
    buildColumns : function() {
        return [
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        iconCls : 'icon-create-dark',
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['createitemclick', true], 0)
                    }
                ]
            },
            {
                header : 'Код',
                dataIndex : 'code',
                width : 400,
                renderer : this.codeRenderer
            },
            {
                xtype : 'templatecolumn',
                header : 'Пользователи',
                dataIndex : 'users',
                sortable : false,
                tdCls : 'nested-columns',
                tpl : this.getUsersTemplateColumn(),
                flex : 1
            }
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Добавить код',
                iconCls : 'icon-create',
                scope : this,
                handler : function() {
                    this.fireEvent('createbtnclick', this);
                }
            },
            {
                text : 'Удалить',
                itemId : 'btnDelete',
                disabled : true,
                iconCls : 'icon-delete',
                scope : this,
                handler : function() {
                    this.fireEvent('deletebtnclick', this);
                }
            },
            {
                xtype : 'uxFilterField',
                emptyText : 'Введите код',
                fieldLabel : 'Поиск',
                labelAlign : 'right',
                labelWidth : 50,
                width : 200,
                editable : true,
                maxLength : 7,
                maskRe : /\d/,
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.getStore().addFilter('code', ((value) ? {'$like' : value} : null));       
                    }
                }
            },
            {
                xtype : 'UsersListField',
                emptyText : 'Выберите пользователя',
                width : 250,
                listeners : {
                    scope : this,
                    select : function(field, record) {
                        field.setValue(record.get('fio'));
                        this.getStore().addFilter('user_id', record.get('id'));
                    },
                    clearfield : function() {
                        this.getStore().addFilter('user_id', null);    
                    }
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
    
    getUsersTemplateColumn : function() {
        return ['<tpl for="users">',
                    '<a class="column" href="javaScript:void(0)" title="Открыть" id="column-user-{user_id}">' +
                        '{last_name} {first_name} {patronymic}',
                    '</a>',
                    '<div class="column-sp">{[(xindex < xcount) ? "&nbsp;" : ""]}</div>',
                '</tpl>'];
    },
    
    codeRenderer : function(v, metaData, record) {
        return Ext.String.repeat("&nbsp;", record.get('depth')*15) + v;
    },
    
    onClickUserColumn : function(view, td, cellIndex, record, tr, rowIndex, e) {
        var column = view.getGridColumns()[cellIndex],
            itemId = String(e.target.id).replace("column-user-", "");
        if (column.isXType('templatecolumn') && itemId) {
            this.fireEvent('useritemclick', this, record, itemId, e);
        }
    },
    
    onToggleBtns : function() {
        var selCount = this.getSelectionModel().getCount();
        
        this.down('#btnDelete').setDisabled(! selCount);
    }
    
});