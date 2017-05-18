Ext.define("App.view.settings.regions.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.DirectoryRegionsGridPanel",
    
    config: {
        timeZonesStore: null
    },
    initComponent: function () {
        
        this.store = Ext.create("App.store.settings.regions.RegionsStore");
        this.timeZonesStore = Ext.create("App.store.settings.regions.TimeZonesStore");
        this.columns = this.buildColumns();
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.on("selectionchange", this.onToggleBtns, this);
        
        this.timeZonesStore.on("load", function () {
            this.getView().refresh()
        }, this);
        
        this.addEvents("createbtnclick", "editbtnclick", "deletebtnclick");
    },
    
    buildPlugins: function () {
        return [{
            ptype: "cellediting",
            pluginId: "cellEditing",
            clicksToEdit: 1
        }];
    },
    
    buildTimeZonesCombo: function () {
        return {
            xtype: "uxCombo",
            store: this.getTimeZonesStore(),
            editable: false,
            allowBlank: false
        }
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                minWidth : 120,
                flex: 1
            },
            {
                xtype : 'templatecolumn',
                header : 'Временная зона сервера',
                align : 'center',
                width : 120,
                tpl : [
                    '<tpl if="is_server_time_zone == 1">',
                        '<div class="col-icon icon-checkmark">&nbsp;</div>',
                    '</tpl>'
                ]
            }
        ];
    },
    
    buildTbar: function () {
        return [
            {
                text: "Добавить регион",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("createbtnclick", this);
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
                tooltip: "Удалить",
                itemId: "btnDelete",
                iconCls: "icon-delete",
                disabled: true,
                scope: this,
                handler: function () {
                    this.fireEvent("deletebtnclick", this);
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
        this.down('#btnEdit').setDisabled(selCount != 1);
    }
    
});