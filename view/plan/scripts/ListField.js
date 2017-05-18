Ext.define("App.view.plan.scripts.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.ScriptsListField",
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ScriptsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1
            },
            {
                header: "Правила",
                dataIndex : 'rules',
                sortable : false,
                flex : 1
            }
        ];
    }
});