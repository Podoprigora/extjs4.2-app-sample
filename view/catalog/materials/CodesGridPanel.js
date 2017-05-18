Ext.define("App.view.catalog.materials.CodesGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.CatalogMaterialCodesGridPanel",
    
    initComponent: function () {
        this.store = Ext.create("App.store.catalog.MaterialCodesLocalStore");
        this.columns = this.buildColumns();
        this.features = this.buildFeatures();
        
        this.callParent(arguments);
    },
    buildFeatures: function () {
        return [{
            ftype: "grouping",
            groupHeaderTpl: "Набор № {name}",
            enableGroupingMenu: false
        }];
    },
    buildColumns: function () {
        return [
            {
                header: "Код",
                dataIndex: "code",
                align: "center",
                width: 100
            }, 
            {
                header: "Наименование",
                dataIndex: "name",
                flex: 1
            }
        ];
    }
});