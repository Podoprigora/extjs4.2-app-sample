Ext.define('App.controller.SettingsController', {
    extend : 'Ext.app.Controller',
    
    views : [
        'settings.ContentPanel'    
    ],
    
    init : function() {
        
        this.control({
            'SettingsContentPanel' : {
                menubtnclick : this.onCreateModuleTab,
                panelready : this.onInitContentPanel
            }   
        });
    },
    
    onCreateModuleTab : function(panel, moduleXType, title, iconCls, closable, refresh) {
        var tabPanel = panel.down('uxTabPanel');
        tabPanel.addTab(moduleXType, title, iconCls, closable, refresh);
    },
    
    onInitContentPanel : function(panel) {
        /* Выполнение действия при начальной загрузке раздела "Настройки"  */        
    }
    
});