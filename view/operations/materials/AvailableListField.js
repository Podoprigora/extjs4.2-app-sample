Ext.define("App.view.operations.materials.AvailableListField", {
    extend : "App.ux.picker.List",
    alias : "widget.AvailableMaterialsListField",
    
    listHeight: 250,
    listWidth: 600,
    
    initComponent: function () {
        this.store = Ext.create("App.store.operations.AvailableMaterialsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [{
            header: "Код",
            dataIndex: "code",
            width: 100,
            align: "center"
        }, {
            header: "Партия",
            dataIndex: "batch",
            width: 100,
            align: "center"
        }, {
            header: "Наименование",
            dataIndex: "name",
            flex: 1
        }, {
            header: "Кол-во",
            dataIndex: "available_qty",
            width: 100,
            align: "center"
        }];
    }
});