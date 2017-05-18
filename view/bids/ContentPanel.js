Ext.define("App.view.bids.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.BidsContentPanel",
    
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    layout : 'fit',
    border : false,
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('panelready');
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'uxTabPanel'
            }
        ];
    }
    
});