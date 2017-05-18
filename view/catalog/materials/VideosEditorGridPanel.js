Ext.define("App.view.catalog.materials.VideosEditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.CatalogMaterialVideosEditorGridPanel",
    
    hideHeaders : true,    
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.catalog.MaterialFilesLocalStore');
        this.columns = this.buildColumns();
        this.dockedItems = [this.buildTbar()];
        this.plugins = this.buildPlugins();
        this.cls += " x-no-dirty";
        
        this.callParent(arguments);
    },
    
    buildPlugins : function(){
        return [
            {
                ptype : 'cellediting',
                pluginId : 'cellEditor',
                clicksToEdit : 0
            }
        ];
    },
    
    buildColumns : function(){
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-delete',
                        tooltip : 'Удалить',
                        scope : this,
                        handler : this.onDeleteRow
                    }
                ]
            },
            {
                xtype : 'templatecolumn',
                width : 35,
                tpl : [
                    '<div class="col-icon24 icon24-gray-file-video">&nbsp;</div>'
                ]
            },
            {
                dataIndex : 'description',
                tdCls : 'x-cell-wrap',
                flex : 1,
                editor : {
                    xtype : 'textarea',
                    name : 'tmp_row_desc',
                    allowBlank : false
                }
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
                        iconCls : 'icon-play',
                        tooltip : 'Воспроизвести',
                        scope : this,
                        handler : this.onPlay
                    }
                ]
            },
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                items : [
                    {
                        iconCls : 'icon-edit',
                        tooltip : 'Редактировать',
                        scope : this,
                        handler : this.onEditRow
                    }
                ]
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
    
    buildTbar : function(){
        return {
            xtype : 'toolbar',
            dock : 'top',
            ui : 'plain',
            items : [
                {
                    text : 'Добавить файл',
                    scope : this,
                    handler : function(){
                        this.fireEvent('addbtnclick', this);
                    }
                }
            ]
        };
    },
    
    onDeleteRow : function(view, rowIndex, colIndex, item, e, record) {
        var grid = view.ownerCt;
        grid.getSelectionModel().select(record);
        App.ux.Msg.confirm("Вы действительно хотите выполнить удаление?", function(btn){
            if (btn == 'yes') {
                record.set('removed', 1);
                grid.getStore().remove(record);
                grid.getView().refresh();
                this.fireEvent('deleteitem', this, record);  
            }
        }, this);
    },
    
    onEditRow : function(view, rowIndex, colIndex, item, e, record){
        this.getPlugin('cellEditor').startEdit(record, 2);    
    },
    
    onDownload : function(view, rowIndex, colIndex, item, e, record){
        view.getSelectionModel().select(record);
        this.fireEvent('downloadbtnclick', this, record);
    },
    
    onPlay : function(view, rowIndex, colIndex, item, e, record){
        view.getSelectionModel().select(record);
        this.fireEvent('playbtnclick', this, record);    
    }
    
});