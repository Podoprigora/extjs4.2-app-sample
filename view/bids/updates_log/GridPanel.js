Ext.define("App.view.bids.updates_log.GridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.BidUpdatesLogGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.bids.UpdatesLogStore");
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
                header: "Кол-во",
                dataIndex: "qty",
                width: 100,
                align: "center",
                sortable : false
            },
            {
                header: "Задача / Материал",
                dataIndex: "name",
                sortable : false,
                flex: 1
            }
        ];
    }
});