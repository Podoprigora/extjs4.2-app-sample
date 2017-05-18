Ext.define("App.view.catalog.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.CatalogContentPanel",
    
    layout: "fit",
    bodyCls: "x-container-body",
    bodyPadding : 5,
    border: false,
    
    initComponent: function () {
        this.items = {
            xtype: "uxTabPanel",
            hidden: false,
            items: [{
                xtype: "CatalogMaterialsContentPanel",
                iconCls: "icon-app-table",
                title: "Карточки",
                closable: false
            }]
        };
        
        this.callParent(arguments);
        this.addEvents("panelready");
    }
    
});