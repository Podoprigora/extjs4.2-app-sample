Ext.define("App.view.settings.area_codes.TreePanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.AreaCodesTreePanel",
    
    rootVisible: false,
    columnLines: true,
    loadAllNodes : false,
    config: {
        callEditor: null,
        revertSpecialKey: false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.area_codes.CodesTreeStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        //this.plugins = [Ext.create('Ext.grid.plugin.BufferedRenderer')];
        
        this.callParent(arguments);
        
        this.addEvents("createitemclick", "usereditoritemclick", 'useritemclick');
        
        this.on("beforeedit", this.onBeforeEdit, this);
        this.on('cellclick', this.onClickUserColumn, this);
        this.on('selectionchange', this.onToggleBtns, this);
        this.getStore().on('load', this.onUpdateTotalLabel, this);
        this.on('beforeitemexpand', this.onBeforeExpandNode, this);
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
                xtype : 'uxFilterField',
                emptyText : 'Введите код (7 цифр)',
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
                        if (value.length == 0) {
                            this.getStore().addFilter('code', null);
                        } else if (value && value.length == 7) {
                            this.getStore().addFilter('code', value);
                        }
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
    
    buildColumns: function () {
        return [
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-create-dark"),
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['createitemclick', true], 0)
                    }
                ]
            }, 
            {
                xtype: "treecolumn",
                header: "Код",
                dataIndex: "code",
                width: 400
            },
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-users-plus-gray", 'Добавить / изменить пользователей'),
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['usereditoritemclick', true], 0)
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Пользователи',
                flex : 1,
                tdCls : 'nested-columns',
                tpl : this.getUsersTemplateColumn(),
                sortable : false
            }
        ];
    },
    
    onBeforeExpandNode : function(node) {
        this.getStore().removeFilter('user_id');
        this.getStore().removeFilter('code');
        return true;
    },
    
    onBeforeEdit: function (editor, e) {
        return (!e.record.isRoot());
    },
    
    onActionColumnGetClass: function (iconCls, tooltip) {
        return function (v, metaData, record) {
            var code = record.get('code');
            if (Ext.isEmpty(tooltip) == false) {
                metaData.tdAttr = Ext.String.format("data-qtip='{0}'", tooltip);   
            }
            if (code%100 > 0 && iconCls == 'icon-create-dark') {
                return '';
            } else {
                return iconCls;    
            }
        }
    },
    
    onActionHandler : function(event, selectRow, view, rowIndex, colIndex, item, e, record, row) {
        if (e.target.className.indexOf("icon-") == -1 || e.getKey() == e.ENTER) {
            return false;
        }
        if (selectRow) {
            view.getSelectionModel().select(record);
        }
        this.fireEvent(event, view, rowIndex, colIndex, item, e, record); 
    },

    getUsersTemplateColumn : function() {
        return ['<tpl for="users">',
                    '<a class="column" href="javaScript:void(0)" title="Открыть" id="column-user-{user_id}">' +
                        '{last_name} {first_name} {patronymic}',
                    '</a>',
                    '<div class="column-sp">{[(xindex < xcount) ? "&nbsp;" : ""]}</div>',
                '</tpl>'];
    },
    
    onClickUserColumn : function(view, td, cellIndex, record, tr, rowIndex, e) {
        var column = view.getGridColumns()[cellIndex];
        if (column.isXType('templatecolumn')) {
            var itemId = String(e.target.id).replace("column-user-", "");
            this.fireEvent('useritemclick', this, record, itemId, e);
        }
    },
    
    onToggleBtns : function(selModel, selected) {
        this.down('#btnDelete').setDisabled(selected.length == 0);
    },
    
    onUpdateTotalLabel : function(store){
        this.down('#Totals').update({'count' : store.getProxy().getReader().jsonData['count'] });
    }
});