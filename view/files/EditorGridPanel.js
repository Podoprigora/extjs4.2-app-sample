Ext.define("App.view.files.EditorGridPanel", {
    extend : "App.ux.grid.BasicGrid",
    alias : "widget.FilesEditorGridPanel",
    
    hideHeaders : true,
    readOnly : false,
    disableSelection : true,
    cls : 'x-no-dirty',
    bodyCls : 'x-container-body',
    
    viewConfig : {
        emptyText : '',
        stripeRows : false,
        trackOver : false
    },
    
    config : {
        uploadUrl : null,
        downloadUrl : null,
        removeDirty : false
    },
    
    initComponent : function(){
        
        this.store = Ext.create('App.store.files.FilesLocalStore');
        this.columns = this.buildColumns();
        this.dockedItems = this.buildDockedItems();
        
        this.callParent(arguments);
        
        this.addEvents('deleteitem', 'selectfile');
    },
    
    buildColumns : function() {
        return [
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                hidden : (this.readOnly || this.removeDirty),
                items : [
                    {
                        getClass : this.getActionColumnClass,
                        scope : this,
                        handler : this.onDeleteRow
                    }
                ]
            },
            {
                dataIndex : 'client_name',
                flex : 1,
                renderer : this.linkRenderer
            },
            {
                xtype : 'actioncolumn',
                width : 30,
                align : 'center',
                hidden : (this.readOnly || this.removeDirty == false),
                items : [
                    {
                        getClass : this.getActionColumnClass,
                        scope : this,
                        handler : this.onDeleteRow
                    }
                ]
            }
        ];
    },
    
    buildDockedItems : function() {
        return [
            {
                dock : 'top',
                xtype : 'form',
                itemId : 'uploadForm',
                border : false,
                bodyPadding : '0 0 5 0',
                hidden : this.readOnly,
                bodyCls : this.bodyCls,
                items : [
                    {
                        xtype : 'filefield',
                        name : 'upload_file',
                        buttonOnly : true,
                        buttonConfig : {
                            text : 'Добавить файл',
                            iconCls : 'icon-create'
                        },
                        listeners : {
                            scope : this,
                            change : this.onSelectFile
                        }
                    }
                ]
            }
        ];    
    },
    
    getActionColumnClass : function(v, metaData, record){
        if ((this.removeDirty && record.get('id') == 0) || this.removeDirty == false) {
            metaData.tdAttr = "data-qtip='Удалить'";
            return 'icon-delete';
        }
    },
    
    onDeleteRow : function(view, rowIndex, colIndex, item, e, record) {
        if ((this.removeDirty && record.get('id') == 0) || this.removeDirty == false) {
            this.fireEvent('deleteitem', this, record);
        } 
    },
    
    onSelectFile : function(field, value) {
        this.fireEvent('selectfile', this, field, value);       
    }
    
});