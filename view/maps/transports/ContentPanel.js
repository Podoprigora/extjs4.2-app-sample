Ext.define("App.view.maps.transports.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MapsTransportsContentPanel",
    
    layout : 'border',
    bodyPadding : 5,
    
    initComponent : function(){
        
        this.items = [
            {
                xtype : 'MapsTransportsGridPanel',
                itemId : 'transportsGrid',
                region : 'west',
                width : 400,
                split : true
            },
            {
                itemId : 'mapPanel',
                region : 'center',
                layout : 'fit',
                items : [
                    {
                        xtype : "panel",
                        bodyCls : 'x-container-body',
                        border : false
                    }
                ]
            }
        ];
        
        this.callParent(arguments);
    }
});