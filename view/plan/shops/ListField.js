Ext.define("App.view.plan.shops.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.PlanShopsListField",
    
    listHeight: 250,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.ShopsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Логин",
                dataIndex: "phone",
                width: 120,
                align: "center"
            },
            {
                header: "Код",
                dataIndex: "code",
                width: 120,
                align: "center"
            },
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1
            }
        ];
    }
    
});