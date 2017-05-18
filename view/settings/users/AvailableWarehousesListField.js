Ext.define("App.view.settings.users.AvailableWarehousesListField", {
    extend : "App.ux.picker.List",
    alias : "widget.UserAvailableWarehousesListField",
    
    listWidth: 450,

    initComponent: function () {
        
        this.store = Ext.create("App.store.settings.users.AvailableWarehousesStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Код",
                dataIndex: "code",
                width: 80,
                align: "center"
            }, 
            {
                header: "Адрес",
                dataIndex : 'address',
                flex: 1
            }
        ];
    }
    
});