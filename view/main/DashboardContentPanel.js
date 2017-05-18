Ext.define("App.view.main.DashboardContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainDashboardContentPanel",
    
    overflowX : 'hidden',
    overflowY : 'scroll',
    bodyCls : 'x-container-body',
    border : false,
    
    layout : {
        type : 'hbox'
    },
    
    defaults : {
        flex : 1
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function(){
        return [
            {
                xtype : 'container'
            },
            {
                xtype : 'container',
                margin : '5 0 5 0',
                minWidth : 850,
                defaults : {
                    ui : 'dashboard-panel'
                },
                items : [
                    {
                        xtype : 'MainSliderPanel'
                    },
                    {
                        title : 'ПОСЛЕДНИЕ НОВОСТИ',
                        xtype : 'MainRecentNewsGridPanel',
                        iconCls : 'icon-file',
                        minHeight : 100,
                        autoHeight : true
                    },
                    {
                        title : 'НОВОЕ ОБОРУДОВАНИЕ',
                        xtype : 'MainCatalogGridPanel',
                        iconCls : 'icon-shipping'
                    },
                    {
                        title : 'ПОМОЩЬ',
                        xtype : 'MainFixedHelpArticlesGridPanel',
                        iconCls : 'icon-help',
                        minHeight : 100,
                        autoHeight : true
                    }
                ]
            },
            {
                xtype : 'container'
            }
        ];
    }
    
});