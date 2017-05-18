Ext.define("App.view.settings.roles.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.RolesContentPanel",
    
    layout : 'border',
    border : false,
    padding : 5,
    
    initComponent : function(){
        
        this.items = this.buildPanels();
        
        this.callParent(arguments);
    },
    
    buildPanels : function() {
        return [
            {
                xtype : 'RolesGridPanel',
                itemId : 'rolesGrid',
                region : 'west',
                minWidth : 300,
                maxWidth : 500,
                flex : 1,
                split : true
            },
            {
                xtype : 'RoleModulesTreeGridPanel',
                itemId : 'modulesTree',
                region : 'center',
                disabled : true
            }
        ];
    }
});