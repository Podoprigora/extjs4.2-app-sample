Ext.define("App.view.main.help.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MainHelpContentPanel",
    
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
                xtype : 'MainHelpGridPanel',
                itemId : 'list',
                minWidth : 200,
                split : true
            },
            {
                region : 'center',
                xtype  : 'MainHelpPreviewPanel',
                itemId : 'view'
            }
        ]
    }
});