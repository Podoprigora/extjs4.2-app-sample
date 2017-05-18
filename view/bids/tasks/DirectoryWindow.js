Ext.define("App.view.bids.tasks.DirectoryWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidTasksDirectoryWindow",
    id : 'BidTasksDirectoryWindow',
    
    title : 'Выберите задачи',
    resizable : true,
    
    initComponent : function(){
        
        this.items = {
            xtype : 'BidTasksDirectoryTreeGridPanel',
            itemId : 'treePanel'
        };
        
        this.callParent(arguments);
    }
});