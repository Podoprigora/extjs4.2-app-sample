Ext.define("App.view.catalog.materials.FilesGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.CatalogMaterialFilesGridPanel",
    
    hideHeaders : true,    
    disabledSelection : true,
    initComponent : function(){
        
        this.store = Ext.create('App.store.catalog.MaterialFilesLocalStore');
        this.columns = this.buildColumns();
        this.viewConfig = Ext.apply({ disableSelection : true }, this.viewConfig);
        
        this.callParent(arguments);
    },
    
    buildColumns : function(){
        return [
            {
                xtype : 'templatecolumn',
                width : 35,
                tpl : [
                    '<div class="col-icon24 icon24-gray-file">&nbsp;</div>'
                ]
            },
            {
                dataIndex : 'description',
                tdCls : 'x-cell-wrap',
                flex : 1
            },
            {
                dataIndex : 'created',
                width : 80,
                align : 'center',
                tdCls : 'x-cell-date',
                renderer : Ext.util.Format.dateRenderer('d.m.Y')
            },
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-file-download',
                        tooltip : 'Скачать',
                        scope : this,
                        handler : this.onDownload
                    }
                ]
            }
        ];
    },
    
    onDownload : function(view, rowIndex, colIndex, item, e, record){
        view.getSelectionModel().select(record);
        this.fireEvent('downloadbtnclick', this, record);
    }
    
});