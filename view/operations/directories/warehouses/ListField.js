Ext.define("App.view.operations.directories.warehouses.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.WarehousesListField",
    
    listWidth: 550,

    initComponent: function () {
        
        this.store = this.store || Ext.create("App.store.operations.directories.WarehousesStore");
        this.store.getProxy().extraParams = Ext.apply({
            with_users: true
        }, this.extraParams);
        
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [{
            header: "Код",
            dataIndex: "code",
            width: 80,
            align: "center"
        }, {
            header: "Наименование",
            dataIndex : 'name',
            flex: 1
        }, {
            header: "Регион",
            dataIndex: "region",
            flex: 1
        }];
    }
    
});