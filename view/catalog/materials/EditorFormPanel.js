Ext.define("App.view.catalog.materials.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.CatalogMaterialEditorFormPanel",
    
    config: {
        materialId: null
    },
    
    layout : {
        type : 'hbox'
    },
    overflowX : 'hidden',
    overflowY : 'scroll',
    bodyCls : 'x-container-body',
    
    plugins : {
        ptype : 'preservescroll'
    },
    
    defaults : {
        bodyCls : 'x-container-body',
        border : false,
        flex : 1
    },
    
    initComponent: function () {
        this.items = this.buildItems();
        this.dockedItems = [this.buildTbar()];
        
        this.callParent(arguments);
        
        
    },
    
    buildItems : function(){
        return [
            {
                xtype : 'container'
            },
            {
                layout : 'anchor',
                minWidth : App.Properties.get('minViewWidth'),
                bodyPadding : '15 5 0 5',
                items : [
                    {
                        xtype: "hidden",
                        name: "id"
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        defaults : {
                            flex : 1,
                            allowBlank : false
                        },
                        items : [
                            {
                                xtype: "textfield",
                                fieldLabel: "Наименование",
                                name: "name",
                                tabIndex: 1
                            },
                            {
                                xtype: "uxTreePicker",
                                store: Ext.create("App.store.catalog.GroupsTreeStore", {
                                    root: {
                                        id: 0,
                                        expanded: false
                                    }
                                }),
                                fieldLabel: "Категория",
                                displayField: "name",
                                name: "group_id",
                                minPickerWidth: 300,
                                labelAlign : 'right',
                                tabIndex: 2
                            }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        defaults : {
                            flex : 1
                        },
                        items : [
                            {
                                xtype : 'textarea',
                                name : 'short_description',
                                fieldLabel : 'Краткое описание',
                                height : 80,
                                margin: '0 0 2 0'
                            },
                            {
                                xtype : 'checkboxfield',
                                boxLabel : 'Подлежит бухгалтерскому оформлению',
                                fieldLabel : '&nbsp;',
                                name : 'require_accounting_culc',
                                tabIndex : 3
                            }    
                        ]
                    },
                    {
                        xtype: 'tinymceTextarea',
                        tinyMCEConfig : {
                            plugins: [
                                "advlist autolink lists link image charmap print preview hr anchor",
                                "searchreplace wordcount visualblocks visualchars code fullscreen",
                                "insertdatetime media nonbreaking save table contextmenu directionality",
                                "emoticons template paste textcolor"
                            ],
                    
                            toolbar1: "undo redo | styleselect formatselect fontselect fontsizeselect | cut copy paste searchreplace preview code fullpage fullscreen",
                            toolbar2: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | forecolor backcolor",
                            toolbar3: "table link unlink anchor inserttime hr | subscript superscript | charmap emoticons | ltr rtl | spellchecker | visualchars visualblocks | removeformat",
                            fontsize_formats: '8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px',
                            content_css : "workspace/build/app/resources/tinymce/contents.css",
                            language: 'ru',
                            menubar: false,
                            toolbar_items_size: 'medium'
                        },
                        border : false,
                        name : 'description',
                        fieldLabel : 'Полное описание',
                        labelAlign : 'top',
                        anchor: '100%',
                        height : 400
                    },
                    {
                        itemId: "codesGrid",
                        xtype: "CatalogMaterialCodesEditorGridPanel",
                        title: "Складские позиции",
                        ui: "in-form",
                        iconCls : 'icon-file-desc',
                        margin : '10 0 0 0',
                        autoHeight: true,
                        minHeight: 170,
                        listeners : {
                            scope : this,
                            expandpicker : function(field){ // Fixed list position considering form scrolling
                                if (Ext.isEmpty(this.scrollPreservedPos) == false) {
                                    field.pickerOffset = [0, 0-this.scrollPreservedPos];
                                    field.doAlign();
                                }
                            }
                        }
                    },
                    {
                        xtype: "ImagesEditorPanel",
                        title : 'Изображения',
                        itemId: "imagesPanel",
                        iconCls : 'icon-file-image',
                        uploadUrl : Settings.urls.getUrl('catalog.materials.upload_image'),
                        previewUrl : Settings.urls.getUrl('catalog.materials.preview_image'),
                        itemWidth : 200,
                        itemHeight : 200,
                        fullSizeView : false,
                        ui: "in-form",
                        margin: "10 0 0 0",
                        autoHeight: true,
                        minHeight : 100
                    },
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        margin : '5 0 50 0',
                        defaults : {
                            flex : 1,
                            ui: "in-form",
                            autoHeight: true,
                            minHeight: 120
                        },
                        items : [
                            {
                                xtype : 'CatalogMaterialFilesEditorGridPanel',
                                itemId : 'filesGrid',
                                title : 'Материалы',
                                iconCls : 'icon-file'
                            },
                            {
                                xtype : 'CatalogMaterialVideosEditorGridPanel',
                                itemId : 'videosGrid',
                                title : 'Видео',
                                iconCls : 'icon-file-video',
                                margin : '0 0 15 10'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'container'
            }
        ];
    },
    
    buildTbar : function(){
        return {
            xtype : 'toolbar',
            dock : 'top',
            layout : 'hbox',
            defaults : {
                flex: 1
            },
            items : [
                {
                    xtype : 'container'    
                },
                {
                    xtype : 'buttongroup',
                    minWidth : App.Properties.get('minViewWidth'),
                    layout : 'hbox',
                    items : [
                        {
                            text : 'Сохранить и создать',
                            iconCls : 'icon-save',
                            scope : this,
                            handler : function() {
                                this.fireEvent('savebtnclick', this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'Сохранить и закрыть',
                            iconCls : 'icon-save-close',
                            scope : this,
                            handler : function() {
                                this.fireEvent('savebtnclick', this, 'close');
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'Отмена',
                            scope : this,
                            handler : function(){
                                this.fireEvent('cancelbtnclick', this);
                            }
                        }
                    ]
                },
                {
                    xtype : 'container'
                }
            ]
        };
    }
});