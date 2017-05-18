Ext.define("App.view.operations.updates_logs.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.OperationUpdatesLogsGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.operations.UpdatesLogsStore");
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        
        this.callParent(arguments);
    },
    
    buildFeatures: function () {
        return [{
            ftype: "grouping",
            groupHeaderTpl: "{name}",
            enableGroupingMenu: false
        }];
    },
    
    buildColumns: function () {
        return [
            {
                xtype : 'templatecolumn',
                width : 25,
                align : 'center',
                tpl : [
                    '<tpl if="status == 1">' +
                        '<div class="col-icon icon-create" data-qtip="Новая запись">&nbsp;</div>' +
                    '<tpl elseif="status == 2">' +
                        '<div class="col-icon icon-pencil" data-qtip="Внесены изменения">&nbsp;</div>' +
                    '<tpl elseif="status == 0">' +
                        '<div class="col-icon icon-cross" data-qtip="Запись удалена">&nbsp;</div>' +
                    '</tpl>'
                ]
            },
            {
                header: "Партия",
                dataIndex: "batch",
                width: 100,
                align: "center",
                sortable: false
            }, 
            {
                header: "Код",
                dataIndex: "code",
                align: "center",
                width: 100,
                sortable: false
            }, 
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1,
                sortable: false
            }, 
            {
                header: "Кол-во",
                dataIndex: "qty",
                width: 100,
                align: "center",
                sortable: false,
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }, 
            {
                header: "Цена, руб.",
                dataIndex: "price",
                width: 100,
                align: "right",
                sortable: false,
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }
        ];
    }
});