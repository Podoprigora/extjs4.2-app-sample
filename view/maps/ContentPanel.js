Ext.define("App.view.maps.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MapsContentPanel",
    
    layout : 'fit',
    
    bodyCls : 'x-container-body',
    bodyPadding : 5,
    border : false,
    
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'uxTabPanel'
            }
        ];
    }

});