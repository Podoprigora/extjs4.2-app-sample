Ext.define("App.view.operations.reports.TransitsGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.OperationIncomingTransitsGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.operations.IncomingTransitsStore");
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        this.tbar = this.buildTbar();
        
        this.viewConfig = Ext.apply({
            trackOver: false,
            disableSelection: true
        }, this.viewConfig);
        
        this.callParent(arguments);
    },
    
    buildFeatures: function () {
        return [{
            ftype: "grouping",
            groupHeaderTpl : '<a href="javaScript:void(0)" title="Открыть" class="icon-view">{name}</a>',
            hideGroupedHeader: true
        }];
    },
    
    buildColumns: function () {
        return [
            {
                header: "Партия",
                dataIndex: "m_batch",
                width: 120,
                align: "center",
                sortable: false
            }, {
                header: "Код",
                dataIndex: "m_code",
                align: "center",
                width: 120
            }, {
                header: "Наименование",
                dataIndex: "m_name",
                minWidth : 250,
                flex: 1
            }, {
                header: "Кол-во",
                dataIndex: "m_qty",
                width: 120,
                align: "center",
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }, {
                header: "Цена, руб.",
                dataIndex: "m_price",
                width: 140,
                align: "right",
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            }, {
                header: "Сумма, руб.",
                dataIndex: "m_amount",
                tdCls: "x-mark-rows",
                width: 140,
                align: "right",
                sortable: false,
                renderer: Ext.util.Format.numberRenderer("0,0.00")
            },
            {
                header : '',
                flex : 1,
                minWidth : 5
            }
        ]
    },
    
    buildTbar: function () {
        return [
            {
                text: "Обновить",
                iconCls: "icon-refresh",
                scope: this,
                handler: this.onRefresh
            },
            "->", 
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
    }
});