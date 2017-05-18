Ext.define("App.view.bids.directories.shops.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.BidsDirectoryShopsListField",
    
    listHeight: 250,
    listWidth : 500,
    
    initComponent: function () {
        this.store = Ext.create('App.store.bids.directories.ShopsStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header : 'Код',
                dataIndex : 'code',
                width : 120,
                align : 'center'
            },
            {
                header : 'Наименование',
                dataIndex : 'name',
                width : 160,
                flex : 1
            },
            {
                header : 'Юр. лицо',
                dataIndex : 'legal_name',
                width : 160,
                flex : 1
            },
            {
                header : 'Адрес',
                flex : 1,
                renderer : this.addressRenderer
            }
        ];
    },
    
    addressRenderer : function(v, metaData, record) {
        var result = [record.get('city'), record.get('address1'), record.get('address2')].join(", ").replace(/,\s$/, "");
        metaData.tdAttr = Ext.String.format("data-qtip = '{0}'", result);
        return result;
    }
    
});