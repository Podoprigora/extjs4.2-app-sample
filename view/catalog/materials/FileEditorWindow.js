Ext.define("App.view.catalog.materials.FileEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.CatalogMaterialFileEditorWindow",
    id : 'CatalogMaterialFileEditorWindow',
    
    title : '',
    width : 450,
    height : 220,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.on('beforehide', this.onBeforeHide, this);
    },
    
    buildForm : function(){
        return {
            xtype : 'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'hiddenfield',
                    name : 'type'
                },
                {
                    xtype : 'filefield',
                    name : 'upload_file',
                    fieldLabel : 'Файл',
                    emptyText : 'Выберите файл',
                    allowBlank : false,
                    margin : '0 0 8 0',
                    buttonConfig : {
                        text : 'Выбрать',
                        padding : 2
                    }
                },
                {
                    xtype : 'textarea',
                    name : 'description',
                    fieldLabel : 'Описание',
                    allowBlank : false,
                    height : 80
                }
            ],
            buttons : [
                {
                    text : 'Загрузить',
                    iconCls : 'icon-file-upload',
                    scope : this,
                    handler : function(){
                        this.fireEvent('uploadbtnclick', this);
                    }
                },
                {
                    text : 'Отмена',
                    scope : this,
                    handler : function(){
                        this.hide();
                    }
                }
            ]
        };
    },
    
    onBeforeHide : function(win){
        win.down('form').getForm().reset();
    }
});