Ext.define("App.view.plan.goods.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.PlanGoodsListField",
    
    listHeight: 250,
    listWidth: 300,
    
    initComponent: function () {
        this.store = Ext.create("App.store.plan.GoodsStore");
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