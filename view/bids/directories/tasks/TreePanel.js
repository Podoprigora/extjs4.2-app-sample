Ext.define("App.view.bids.directories.tasks.TreePanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.BidsDirectoryTasksTreePanel",
    
    rootVisible: false,
    columnLines: true,
    loadAllNodes : false,
    config: {
        callEditor: null,
        revertSpecialKey: false
    },    
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.bids.directories.TasksTreeStore');
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = [Ext.create('Ext.grid.plugin.BufferedRenderer')]; 
        
        this.callParent(arguments);
        
        this.addEvents("createrootitemclick");
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Новая задача',
                iconCls : 'icon-create',
                scope : this,
                handler : function() {
                    this.fireEvent('createrootitemclick', this);
                }
            },
            {
                xtype : 'AreaCodesListField',
                emptyText : 'Выберите код территории',
                fieldLabel : 'Фильтры',
                labelAlign : 'right',
                labelWidth : 70,
                width : 260,
                listeners : {
                    scope : this,
                    select : function(field, record) {
                        field.setValue(record.get('code'));
                        this.getStore().addFilter('area_code', record.get('code'));
                    },
                    clearfield : function() {
                        this.getStore().addFilter('area_code', null);   
                    }
                }
            },
            {
                xtype : 'uxFilterField',
                emptyText : 'Введите наименование',
                editable : true,
                minLength : 3,
                labelAlign : 'right',
                width : 200,
                margin : '0 0 0 5',
                listeners : {
                    scope : this,
                    search : function(value) {
                        this.getStore().addFilter('query', (value.length) ? {'$like' : value} : null);
                    }
                }
            },
            '->',
            { 
                tooltip : 'Обновить',
                iconCls : 'icon-refresh',
                scope : this,
                handler : this.onRefresh
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
                        getClass: this.onActionColumnGetClass("icon-delete"),
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['deleteitemclick', true], 0)
                    }
                ]
            },
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-edit"),
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['edititemclick', true], 0)
                    }
                ]
            },
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-create-dark"),
                        scope: this,
                        handler : function(view, rowIndex, colIndex, item, e, node) {
                            if (! node.isLeaf() && ! node.isExpanded()) {
                                node.expand();
                            }
                            this.onActionHandler('createitemclick', true, view, rowIndex, colIndex, item, e, node);
                        }
                    }
                ]
            },
            {
                xtype: "treecolumn",
                header: "Наименование",
                dataIndex: "name",
                minWidth: 380,
                flex : 1
            },
            {
                header: "Тип",
                dataIndex: "type",
                align : 'center',
                width: 100
            },
            {
                header : 'Приоритет',
                dataIndex : 'priority',
                width : 80,
                align : 'center',
                renderer : this.cellRenderer
            },
            {
                header : 'Стоимость заказчика',
                dataIndex : 'customer_price',
                width : 100,
                align : 'right',
                renderer : function(value, metaData, record){
                    return this.cellRenderer(Ext.util.Format.number(value, '0,0.00'), metaData, record);
                }
            },
            {
                header : 'Стоимость исполнителя',
                dataIndex : 'performer_price',
                width : 100,
                align : 'right',
                renderer : function(value, metaData, record){
                    return this.cellRenderer(Ext.util.Format.number(value, '0,0.00'), metaData, record);
                }
            },
            {
                header : 'Кол-во людей',
                dataIndex : 'peoples_qty',
                width : 100,
                align : 'center',
                renderer : this.cellRenderer
            },
            {
                header : 'Кол-во минут',
                dataIndex : 'minutes_qty',
                width : 100,
                align : 'center',
                renderer : this.cellRenderer
            },
            {
                xtype : 'templatecolumn',
                header : 'Требуется указать оборудование',
                align : 'center',
                width : 120,
                tpl : [
                    '<tpl if="need_equipment == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Бухгалтерское оформление',
                align : 'center',
                width : 120,
                tpl : [
                    '<tpl if="require_accounting_culc == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Доступно при заказе',
                align : 'center',
                width : 100,
                tpl : [
                    '<tpl if="visible_for_ordering == 1">',
                        '<div class="col-icon icon-checkmarkt">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Доступно при выполнении',
                align : 'center',
                width : 100,
                tpl : [
                    '<tpl if="visible_for_performance == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Исчисляемое',
                align : 'center',
                width : 100,
                tpl : [
                    '<tpl if="countable == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Скрыто',
                width : 60,
                align : 'center',
                tpl : [
                    '<tpl if="is_hidden == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            },
            {
                header : 'Дата изменения',
                dataIndex : 'updated',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            }
        ];
    },
    
    cellRenderer : function(v, metaData, node) {
        if (node.isRoot()) {
            return '';
        }
        return v;
    },
    
    onActionColumnGetClass: function (iconCls, tooltip) {
        return function (v, metaData, record) {
            if (record.isRoot()) {
                return '';
            }
            if (Ext.isEmpty(tooltip) == false) {
                metaData.tdAttr = Ext.String.format("data-qtip='{0}'", tooltip);   
            }
            return iconCls;
        }
    }
    
});