Ext.define("App.view.main.news.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainNewsContentPanel",
    
    layout : 'border',
    border : false,
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
                region : 'west',
                xtype : 'MainNewsGridPanel',
                itemId : 'list',
                minWidth : 200,
                split : true
            },
            {
                region : 'center',
                xtype  : 'MainNewsPreviewPanel',
                itemId : 'view'
            }
        ]
    }
});