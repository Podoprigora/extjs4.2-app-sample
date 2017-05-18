Ext.define("App.view.bids.directories.trustees.ListField", {
    extend : "App.ux.picker.List",
    alias : "widget.BidsDirectoryTrusteesListField",
    
    listHeight: 250,
    listWidth : 500,
    
    initComponent: function () {
        this.store = Ext.create('App.store.bids.directories.TrusteesStore');
        this.columns = this.buildColumns();
        
        this.callParent(arguments);
    },
    
    buildColumns: function () {
        return [
            {
                header : 'ФИО родительный падеж',
                dataIndex : 'fio2',
                flex : 1
            },
            {
                header : 'Должность',
                dataIndex : 'position',
                flex : 1
            },
            {
                header : 'Основание',
                dataIndex : 'basis',
                renderer : this.basisRenderer,
                flex : 1
            }
        ];
    },
    
    basisRenderer : function(v, metaData, record) {
        metaData.tdAttr = Ext.String.format("data-qtip = '{0}'", v);
        return v;
    }
    
});