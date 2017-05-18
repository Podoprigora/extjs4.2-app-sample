Ext.define('App.controller.MapsController', {
    extend : 'Ext.app.Controller',
    
    models : [
    
    ],
    
    stores : [
    
    ],
    
    views : [
        'maps.ContentPanel'   
    ],
    
    init : function() {
        this.control({
            'MapsContentPanel' : {
                panelready : this.onInitContentPanel
            }
        });   
    },
    
    onInitContentPanel : function(panel) {
        panel.down('uxTabPanel').addTab('MapsTransportsContentPanel', 'Автотранспорт', 'icon-place', false);
    }
    
});