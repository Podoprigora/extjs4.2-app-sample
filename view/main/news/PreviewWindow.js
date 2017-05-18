Ext.define("App.view.main.news.PreviewWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MainNewsPreviewWindow",
    
    title : "Новость",
    width : 800,
    height : 600,
    
    initComponent : function(){
        
        this.items = { 
            xtype : 'MainNewsPreviewPanel',
            itemId : 'viewPanel'
        };
        
        this.callParent(arguments);
    }
});