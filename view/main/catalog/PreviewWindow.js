Ext.define("App.view.main.catalog.PreviewWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MainCatalogPreviewWindow",
    
    title : "Оборудование",
    width : 700,
    height : 700,
    
    initComponent : function(){
        
        this.items = { 
            xtype : 'CatalogMaterialViewPanel',
            itemId : 'viewPanel'
        };
        
        this.callParent(arguments);
    }
});