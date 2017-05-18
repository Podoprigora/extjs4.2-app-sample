Ext.define("App.view.bids.materials.DirectoryWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidMaterialsDirectoryWindow",
    id : 'BidMaterialsDirectoryWindow',
    
    title : 'Выбрать материалы',
    resizable : true,
    
    config : {
        materialTaskRecord : null,
        masterGrid : null
    },
    
    initComponent : function(){
        
        this.items = {
            xtype : 'BidMaterialsDirectoryGridPanel'
        };
        
        this.callParent(arguments);
    }
});