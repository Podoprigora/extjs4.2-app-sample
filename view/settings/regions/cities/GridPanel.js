Ext.define("App.view.settings.regions.cities.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryRegionCitiesGridPanel",
    
    features: [{
        ftype: "grouping",
        enableGroupingMenu: false,
        groupHeaderTpl: "{name}"
    }],
    
    selModel: {
        selType: "checkboxmodel",
        mode: "MULTI"
    },
    
    initComponent: function () {
        this.store = Ext.create("App.store.settings.regions.CitiesStore", {
            groupField: "region"
        });
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
        }];
    },
    
    buildColumns: function () {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 100,
                align : 'center',
                editor : {
                    xtype: "textfield",
                    allowBlank: false   
                }
            },
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1,
                editor: {
                    xtype: "textfield",
                    allowBlank: false
                }
            }
        ];
    },
    
    buildTbar: function () {
        return [{
            text: "Добавить город",
            iconCls: "icon-create",
            itemId: "btnCreate",
            disabled: true,
            scope: this,
            handler: function () {
                this.fireEvent("createbtnclick", this);
            }
        }, {
            tooltip : "Удалить",
            iconCls: "icon-delete",
            itemId: "btnDelete",
            disabled: true,
            scope: this,
            handler: function () {
                this.fireEvent("deletebtnclick", this);
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
        }]
    },
    
    onToggleBtns: function () {
        var selCount = this.getSelectionModel().getCount();
        this.down("#btnDelete").setDisabled(!selCount);
    }
});