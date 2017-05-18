Ext.define("App.view.catalog.groups.EditorTreePanel", {
    extend : "App.ux.tree.TreeGridPanel",
    alias : "widget.CatalogGroupsEditorTreePanel",
    
    rootVisible: true,
    columnLines: true,
    config: {
        callEditor: null,
        revertSpecialKey: false
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.catalog.GroupsTreeStore");
        this.columns = this.buildColumns();
        this.plugins = [this.cellEditor = Ext.create("Ext.grid.plugin.CellEditing")];
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents("createitemclick", "edititemclick", "deleteitemclick");
        this.on("beforeedit", this.onBeforeEdit, this);
    },
    
    buildTbar: function () {
        return [{
            text: "Обновить",
            iconCls: "icon-refresh",
            scope: this,
            handler: this.onRefresh
        }];
    },
    
    buildColumns: function () {
        return [{
            xtype: "actioncolumn",
            width: 26,
            align: "center",
            items: [{
                getClass: this.onActionColumnGetClass("icon-delete"),
                scope: this,
                handler: function (view, rowIndex, colIndex, item, e, record) {
                    view.getSelectionModel().select(record);
                    if (e.getKey() == e.ENTER) {
                        this.fireEvent("edititemclick", view, rowIndex, colIndex, item, e, record);
                    } else {
                        this.fireEvent("deleteitemclick", view, rowIndex, colIndex, item, e, record);
                    }
                }
            }]
        }, {
            xtype: "actioncolumn",
            width: 26,
            align: "center",
            items: [{
                getClass: this.onActionColumnGetClass("icon-edit"),
                scope: this,
                handler: function (view, rowIndex, colIndex, item, e, record) {
                    view.getSelectionModel().select(record);
                    this.fireEvent("edititemclick", view, rowIndex, colIndex, item, e, record);
                }
            }]
        }, {
            xtype: "actioncolumn",
            width: 26,
            align: "center",
            items: [{
                getClass: this.onActionColumnGetClass("icon-create-dark"),
                scope: this,
                handler: function (view, rowIndex, colIndex, item, e, record) {
                    this.fireEvent("createitemclick", view, rowIndex, colIndex, item, e, record);
                }
            }]
        }, {
            xtype: "treecolumn",
            header: "Наименование",
            dataIndex: "name",
            minWidth: 400,
            flex: 1,
            editor: {
                xtype: "textfield",
                allowBlank: false
            }
        }];
    },
    
    onBeforeEdit: function (editor, e) {
        return (!e.record.isRoot());
    },
    
    onActionColumnGetClass: function (iconCls) {
        return function (v, metaData, record) {
            if (iconCls == "icon-create-dark") {
                return iconCls;
            } else {
                return (!record.isRoot()) ? iconCls : "";
            }
        }
    }
});