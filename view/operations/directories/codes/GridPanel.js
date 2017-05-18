Ext.define("App.view.operations.directories.codes.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryCodesGridPanel",
    
    selModel: {
        selType: "checkboxmodel"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.operations.directories.CodesStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = this.buildPlugins();
        
        this.callParent(arguments);
        
        this.on("selectionchange", this.onToggleBtns, this);
        this.addEvents("createbtnclick", "deletebtnclick", "changefilter");
    },
    
    buildPlugins: function () {
        return [{
            ptype: "cellediting",
            pluginId: "cellEditing",
            clicksToEdit: 1
        }];
    },
    
    buildColumns: function () {
        return [{
            header: "Код",
            dataIndex: "code",
            width: 160,
            align: "center",
            editor: {
                xtype: "textfield",
                allowBlank: false
            }
        }, {
            header: "Примечание",
            dataIndex: "description",
            flex: 1,
            editor: {
                xtype: "textfield"
            }
        }];
    },
    
    buildTbar: function () {
        return [{
            text: "Добавить код",
            iconCls: "icon-create",
            scope: this,
            handler: function () {
                this.fireEvent("createbtnclick", this)
            }
        }, {
            tooltip: "Удалить",
            itemId: "btnDelete",
            iconCls: "icon-delete",
            disabled: true,
            scope: this,
            handler: function () {
                this.fireEvent("deletebtnclick", this)
            }
        }, {
            xtype: "uxFilterField",
            fieldLabel: "Поиск",
            editable: true,
            fieldLabel: "Поиск",
            labelAlign: "right",
            labelWidth: 60,
            width: 280,
            emptyText: "Введите код",
            listeners: {
                scope: this,
                search: this.onChangeFilter
            }
        }, "->", {
            tooltip: "Обновить",
            iconCls: "icon-refresh",
            scope: this,
            handler: this.onRefresh
        }, {
            xtype: "tbspacer"
        }, {
            xtype: "component",
            itemId: "Totals",
            cls: "x-component-grid-text-item",
            tpl: "Всего: <b>{count}</b>"
        }, {
            xtype: "tbspacer"
        }];
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(!selCount);
    },
    
    onChangeFilter: function (value) {
        this.fireEvent("changefilter", this, value);
    }
});