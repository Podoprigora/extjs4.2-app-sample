Ext.define("App.view.operations.profile.IssueContentPanel", {
    extend : "App.view.operations.profile.BasicContentPanel",
    alias : "widget.OperationIssueProfileContentPanel",
    
    initComponent: function () {
        this.callParent(arguments)
    },
    
    buildMaterialsGrid: function () {
        return {
            title: "Материалы",
            xtype: "OperationIssueMaterialsEditorGridPanel",
            itemId: "materialsGrid",
            ui: "in-form",
            autoHeight: true,
            minHeight: 150,
            readOnly: this.readOnly
        }
    }
});