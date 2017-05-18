Ext.define("App.view.plan.reports.ShopFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.PlanReportShopFormPanel",
    
    config: {
        reportShopId: null,
        reportDate: null
    },
    
    bodyPadding: 5,
    bodyCls: "x-container-body",
    border: false,
    layout : 'fit',
    
    initComponent: function () {
        
        this.items = this.buildItems();
        this.tbar = this.buildTbar();
        this.callParent(arguments);
        
        this.addEvents('selectreportdate', 'reloadbtnclick', 'showshopbtnclick');
    },
    
    buildTbar: function () {
        return [
            {
                xtype: "datefield",
                itemId: "dateFilterField",
                fieldLabel: "Дата отчета",
                labelAlign: "right",
                width: 200,
                labelWidth: 80,
                allowBlank: false,
                format: "d.m.Y",
                padding: 2,
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        this.fireEvent("selectreportdate", this, record);
                    }
                }
            },
            {
                text : 'Обновить',
                iconCls : 'icon-refresh',
                margin : '0 0 0 5',
                scope : this,
                handler : function(){
                    this.fireEvent('reloadbtnclick', this);
                }
            },
            {
                text : 'Данные торговой точки',
                iconCls : 'icon-view',
                margin : '0 0 0 10',
                scope : this,
                handler : function(){
                    this.fireEvent('showshopbtnclick', this);
                }
            }
            
        ];
    },
    
    buildItems : function(){
        
        return {
            xtype : 'tabpanel',
            itemId : 'equipmentsTabPanel',
            plan : true,
            minTabWidth : 120
        };     
    }
    
});