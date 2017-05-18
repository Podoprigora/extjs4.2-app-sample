Ext.define("App.view.catalog.materials.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.CatalogMaterialsListField",
    
    initComponent: function () {
        this.store = Ext.create("App.store.catalog.MaterialsStore");
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header: "Наименование",
                dataIndex : 'name',
                flex: 1,
                renderer : function(v, metaData) {
                    if (v) {
                        metaData.style = "white-space:normal;"
                    }
                    return v;
                }
            }, 
            {
                header: "Категория",
                dataIndex: "group_name",
                flex: 1
            }
        ];
    }
    
});