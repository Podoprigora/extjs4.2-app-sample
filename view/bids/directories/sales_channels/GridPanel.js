Ext.define("App.view.bids.directories.sales_channels.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidsDirectorySalesChannelsGridPanel",
    
    selModel: {
        selType: "checkboxmodel"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.bids.directories.SalesChannelsStore");
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
                width: 200,
                editor: {
                    xtype: "textfield",
                    allowBlank: false
                }
            },
            {
                header: "Код в базе",
                dataIndex: "code",
                width: 200,
                editor: {
                    xtype: "textfield",
                    allowBlank: false
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
                text: "Добавить канал",
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