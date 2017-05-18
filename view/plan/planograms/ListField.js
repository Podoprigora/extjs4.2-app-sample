Ext.define("App.view.plan.planograms.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.PlanogramsListField",
    
    listHeight: 250,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.PlanogramsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [{
            header: "Наименование",
            dataIndex: "name",
            flex: 1
        }];
    }
});