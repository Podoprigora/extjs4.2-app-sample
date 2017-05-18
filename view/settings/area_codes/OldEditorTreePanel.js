Ext.define("App.view.settings.area_codes.OldEditorTreePanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.OldAreaCodesEditorTreePanel",
    
    rootVisible: true,
    columnLines: true,
    config: {
        callEditor: null,
        revertSpecialKey: false
    },    
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.settings.area_codes.CodesTreeStore');
        this.columns = this.buildColumns();
        this.plugins = [this.cellEditor = Ext.create("Ext.grid.plugin.CellEditing")];
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createitemclick", "edititemclick", "deleteitemclick", "usereditoritemclick", 'useritemclick');
        this.on("beforeedit", this.onBeforeEdit, this);
        this.on('cellclick', this.onClickUserColumn, this);
    },
    
    buildTbar: function () {
        return [
            {
                text: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
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
                        handler : Ext.bind(this.onActionHandler, this, ['createitemclick', false], 0)
                    }
                ]
            }, 
            {
                xtype: "treecolumn",
                header: "Код",
                dataIndex: "code",
                width: 200,
                editor: {
                    xtype: "textfield",
                    allowBlank: false
                }
            },
            {
                xtype: "actioncolumn",
                width: 26,
                align: "center",
                items: [
                    {
                        getClass: this.onActionColumnGetClass("icon-users-plus-gray", 'Добавить / изменить пользователей'),
                        scope: this,
                        handler : Ext.bind(this.onActionHandler, this, ['adduseritemclick', true], 0)
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                header : 'Пользователи',
                flex : 1,
                tdCls : 'nested-columns',
                tpl : this.getUsersTemplateColumn()
            }
        ];
    },
    
    onBeforeEdit: function (editor, e) {
        return (!e.record.isRoot());
    },
    
    onActionColumnGetClass: function (iconCls, tooltip) {
        return function (v, metaData, record) {
            var cls = "";
            if (iconCls == "icon-create-dark") {
                cls = (record.get('code')%100 == 0 || record.isRoot()) ? iconCls : "";
            } else {
                cls = (!record.isRoot()) ? iconCls : "";    
            }
            if (tooltip && cls.length) {
                metaData.tdAttr = Ext.String.format("data-qtip='{0}'", tooltip);
            }
            return cls;
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
                    '<a class="column" href="javaScript:void(0)" title="Открыть" id="column-user-{id}">' +
                        '{fio}',
                        /*'<div class="column-text" title="Открыть">{fio}</div> ' +
                        '<div class="icon-delete" title="Удалить">&nbsp;</div>' +*/
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
    }
});