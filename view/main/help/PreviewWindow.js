Ext.define("App.view.main.help.PreviewWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MainHelpPreviewWindow",
    
    title : "Помощь",
    width : 800,
    height : 600,
    
    initComponent : function(){
        
        this.items = { 
            xtype : 'MainHelpPreviewPanel',
            itemId : 'viewPanel'
        };
        
        this.callParent(arguments);
    }
});