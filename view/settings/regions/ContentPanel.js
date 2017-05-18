Ext.define("App.view.settings.regions.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.DirectoryRegionsContentPanel",
    
    layout : 'border',
    bodyPadding : 5,
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('initpanel');
    },
    
    buildItems : function() {
        return [
            {
                region : 'west',
                xtype : 'DirectoryRegionsGridPanel',
                flex : 1,
                minWidth : 300,
                split : true
            },
            {
                region : 'center',
                xtype : 'DirectoryRegionCitiesGridPanel'
            }
        ];
    },
    
    onInitPanel : function(panel) {
        this.fireEvent('initpanel', this);
    } 
});