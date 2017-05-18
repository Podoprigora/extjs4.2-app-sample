Ext.define("App.view.messages.ContentPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MessagesContentPanel",
    
    layout: "border",
    bodyPadding: 5,
    border: false,
    
    initComponent: function () {
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents("panelready");
    },
    
    buildItems: function () {
        return [
            {
                xtype: "MessagesGridPanel",
                region: "west",
                split: true,
                minWidth: 450,
                flex: 1
            }, 
            {
                xtype: "MessageEditorPanel",
                region: "center",
                disabled: true
            }
        ];
    }
});