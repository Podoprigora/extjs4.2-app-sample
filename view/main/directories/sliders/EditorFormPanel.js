Ext.define("App.view.main.directories.sliders.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.MainDirectorySliderEditorFormPanel",
    
    layout : 'hbox',
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
    
    config : {
        sliderId : null
    },
    
    initComponent : function(){
        
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
                        xtype : 'hiddenfield',
                        name : 'id'
                    },
                    {
                        xtype : 'hiddenfield',
                        name : 'image_path'
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Наименование',
                                name : 'name',
                                allowBlank : false,
                                flex : 1
                            },
                            {
                                xtype : 'uxCombo',
                                name : 'region_id',
                                store : Ext.create('App.store.settings.regions.RegionsStore'),
                                fieldLabel : 'Привязка',
                                labelAlign : 'right',
                                emptyText : 'Все регионы',
                                enableReset : true,
                                flex : 1
                            }   
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        items : [
                            {
                                xtype : 'numberfield',
                                fieldLabel : 'Порядок',
                                name : 'priority',
                                allowBlank : false,
                                width : 180
                            },
                            {
                                xtype : 'checkboxfield',
                                name : 'is_archive',
                                inputValue : 1,
                                fieldLabel : 'Перенести в архив',
                                labelWidth : 140,
                                margin : '0 0 0 25',
                                flex : 1
                            }
                        ]
                    
                    },
                    {
                        xtype: 'tinymceTextarea',
                        tinyMCEConfig : {
                            plugins : [
                                "textcolor preview code fullscreen wordcount"    
                            ],
                            toolbar1: "undo redo | styleselect formatselect fontselect fontsizeselect | preview code fullpage fullscreen",
                            toolbar2 : "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent | forecolor backcolor removeformat ",
                            content_css : "resources/tinymce/contents.css",
                            fontsize_formats: '8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px',
                            content_css : "workspace/build/app/resources/tinymce/contents.css",
                            language: 'ru',
                            menubar: false,
                            toolbar_items_size: 'medium'
                        },
                        border : false,
                        name : 'text',
                        fieldLabel : 'Текст',
                        labelAlign : 'top',
                        height : 350,
                        anchor: '100%',
                        listeners : {
                            scope : this,
                            change : this.onUpdateImagePreview,
                            blur : this.onUpdateImagePreview
                        }
                    },
                    {
                        xtype: "form",
                        itemId: "uploadForm",
                        border: false,
                        bodyPadding: "10 0 0 0",
                        bodyCls : 'x-container-body',
                        items: [
                            {
                                xtype: "filefield",
                                name: "upload_file",
                                buttonOnly: true,
                                buttonConfig: {
                                    text: "Выберите изображение (3,5:1)"
                                },
                                listeners: {
                                    scope: this,
                                    change: function(field, value) {
                                        this.fireEvent("selectimage", this, field, value);
                                    }
                                }
                            },
                            {
                                xtype: "panel",
                                itemId: "imagePreview",
                                height : 250,
                                width : 850,
                                margin: "10 0 25 0",
                                bodyCls : 'x-container-body image-preview',
                                tpl : [
                                '<div class="slide-item">',
                                    '<div class="text">{text}</div>',
                                    '<img src="{image_path}">',
                                '</div>'
                                ]
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
    },
    
    onUpdateImagePreview : function(){
        var imagePreviewPanel = this.down('#imagePreview'),
            basicForm = this.getForm(),
            text = basicForm.findField('text').getValue(),
            imagePath = basicForm.findField('image_path').getValue(); 
            
        imagePreviewPanel.update({
            text : text,
            image_path : imagePath
        });
    }
    
});