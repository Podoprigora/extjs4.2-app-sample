Ext.define("App.view.bids.directories.tasks_types.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectoryTasksTypesGridPanel",
    
    selModel: {
        selType: "checkboxmodel"
    },
    
    cls : 'x-no-dirty',
    
    initComponent: function () {
        this.store = Ext.create("App.store.bids.directories.TasksTypesStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        this.plugins = this.buildPlugins();
        
        this.callParent(arguments);
        
        this.on("selectionchange", this.onToggleBtns, this);
        this.addEvents("createbtnclick", "deletebtnclick");
    },
    
    buildPlugins: function () {
        return [{
            ptype: "cellediting",
            pluginId: "cellEditing",
            clicksToEdit: 1
        }]
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                width: 260,
                editor: {
                    xtype: "textfield",
                    allowBlank: false
                }
            },
            {
                header: "Порядок",
                dataIndex: "position",
                align : 'center',
                width: 60,
                editor: {
                    xtype: "numberfield"
                }
            },
            {
                header : 'Дата изменения',
                dataIndex : 'updated',
                width : 140,
                align : 'center',
                renderer : Ext.util.Format.dateRenderer('d.m.Y H:i:s')
            },
            {
                flex : 1
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this)
                }
            }, 
            {
                tooltip: "Удалить",
                itemId: "btnDelete",
                iconCls: "icon-delete",
                disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this)
                }
            }, 
            "->", 
            {
                tooltip: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            }, 
            {
                xtype: "tbspacer"
            }, 
            {
                xtype: "component",
                itemId: "Totals",
                cls: "x-component-grid-text-item",
                tpl: "Всего: <b>{count}</b>"
            }, 
            {
                xtype: "tbspacer"
            }
        ];
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(!selCount);
    },
    
    onChangeFilter: function (value) {
        this.fireEvent("changefilter", this, value);
    }
});