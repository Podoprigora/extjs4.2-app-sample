Ext.define('App.ux.container.Card', {
    extend : 'Ext.panel.Panel',
    alias : 'widget.uxCardPanel',
    layout : {
        type : 'card',
        deferredRender : false,
        forceLayout : true
    },
    activeItem : 0,
    history : new Array(), 
    
    initComponent : function() {
        
        this.callParent(arguments);
        
        if (Ext.isDefined(this.xitems)) {
            Ext.Array.each(this.xitems, function(item) {
                this.add(item);
            }, this);
        }
        
        this.on('afterrender', function(card){
            var activePanel = card.getLayout().getActiveItem();
            if (activePanel.isVisible()) {
                new Ext.util.DelayedTask(function(){ 
                    activePanel.fireEvent('panelready', activePanel); 
                }).delay(200);
            }   
        });
    },
    
    onSwitchPanel : function(module) {
        if (Ext.isDefined(module)) {
            var workspace = this,
                layout = workspace.getLayout(),
                activePanel = layout.getActiveItem(),
                activePanelIndex = workspace.items.indexOf(activePanel),
                
                panels = workspace.query(module),
                newPanel = panels[0],
                newPanelIndex = workspace.items.indexOf(newPanel);

            if (activePanelIndex != newPanelIndex && newPanelIndex >= 0) {
                if (Ext.isIE8m) {
                    layout.setActiveItem(newPanelIndex);
                
                    if (Ext.isEmpty(newPanel.isReady)) {
                        newPanel.isReady = true;
                        newPanel.fireEvent('panelready', newPanel); 
                    }    
                } else {
                    activePanel.getEl().fadeOut({
                        opacity: 0.6, 
                        duration: 150,
                        callback: function() {
                            layout.setActiveItem(newPanel);
                            newPanel.getEl().dom.style.opacity = 0.6;
                            newPanel.getEl().fadeIn({duration: 150});
                            
                            if (Ext.isEmpty(newPanel.isReady)) {
                                newPanel.isReady = true;
                                newPanel.fireEvent('panelready', newPanel); 
                            }
                        }
                    });       
                }
            }
            
        }  
    }
    
});