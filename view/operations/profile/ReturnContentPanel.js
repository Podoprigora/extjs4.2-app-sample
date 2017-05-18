Ext.define("App.view.operations.profile.ReturnContentPanel", {
    extend : "App.view.operations.profile.BasicContentPanel",
    alias : "widget.OperationReturnProfileContentPanel",
    
    initComponent: function () {
        this.callParent(arguments)
    },
    
    buildMaterialsGrid: function () {
        return {
            title: "Материалы",
            xtype: "OperationReturnMaterialsEditorGridPanel",
            itemId: "materialsGrid",
            ui: "in-form",
            autoHeight: true,
            readOnly: this.readOnly,
            minHeight: 150
        }
    }
});