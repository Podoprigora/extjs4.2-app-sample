Ext.define("App.view.main.directories.help_articles.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.MainDirectoryHelpArticleEditorFormPanel",
    
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
        articleId : null
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
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        defaults : {
                            allowBlank : false
                        },
                        items : [
                            {
                                xtype : 'uxCombo',
                                store : Ext.create('App.store.main.directories.HelpGroupsStore', { buffered : false, pageSize : 500 }),
                                name : 'group_id',
                                fieldLabel : 'Группа',
                                allowBlank : false,
                                width : 320
                            },
                            {
                                xtype : 'textfield',
                                name : 'title',
                                fieldLabel : 'Оглавление',
                                labelAlign : 'right',
                                flex : 1,
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        items : [
                            
                            {
                                xtype : 'numberfield',
                                name : 'priority',
                                fieldLabel : 'Порядок',
                                width : 180
                            },
                            { xtype : 'label', flex : 1 },
                            {
                                xtype : 'checkboxfield',
                                name : 'is_visible_on_dashboard',
                                inputValue : 1,
                                checked : true,
                                fieldLabel : 'Добавить на рабочий стол',
                                labelWidth : 160,
                                width : 220
                            },
                            {
                                xtype : 'checkboxfield',
                                name : 'is_archive',
                                inputValue : 1,
                                fieldLabel : 'Перенести в архив',
                                labelWidth : 140,
                                width : 160
                            }
                        ]
                    },
                    {
                        xtype : 'form',
                        itemId : 'frmFileUpload',
                        hidden : true,
                        items : [
                            {
                                xtype : 'filefield',
                                name : 'upload_file',
                                previewInput : null,
                                listeners : {
                                    scope : this,
                                    change : function(field, value){
                                        this.fireEvent('uploadfile', this.down('#frmFileUpload'), field);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'tinymceTextarea',
                        tinyMCEConfig : {
                            plugins: [
                                "advlist autolink lists link image charmap print preview hr anchor pagebreak",
                                "searchreplace wordcount visualblocks visualchars code fullscreen",
                                "insertdatetime media nonbreaking save table contextmenu directionality",
                                "emoticons template paste textcolor imagetools"
                            ],
                    
                            toolbar1: "undo redo | styleselect formatselect fontselect fontsizeselect | cut copy paste searchreplace preview code fullpage fullscreen",
                            toolbar2: "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote | forecolor backcolor",
                            toolbar3: "image table link unlink anchor media inserttime hr | subscript superscript | charmap emoticons | ltr rtl | spellchecker | visualchars visualblocks | removeformat",
                            fontsize_formats: '8px 9px 10px 11px 12px 13px 14px 15px 16px 18px 20px 22px 24px 26px 28px 30px 32px 34px 36px',
                            content_css : "workspace/build/app/resources/tinymce/contents.css",
                            language: 'ru',
                            menubar: false,
                            toolbar_items_size: 'medium',
                            image_advtab : true,
                            
                            scope : this,
                            file_browser_callback : Ext.bind(this.onFileBrowserCallback, this)
                        },
                        border : false,
                        name : 'text',
                        fieldLabel : 'Текст',
                        labelAlign : 'top',
                        allowBlank : false,
                        anchor: '100%',
                        height : 600,
                        margin : '0 0 25 0'
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
    
    onFileBrowserCallback : function(fieldName, url, type, win) {
        if (type == 'image'){            
            var fileField = this.down('#frmFileUpload').down('filefield');
            fileField.previewInput = Ext.get(fieldName);
            fileField.fileInputEl.dom.click();
        }    
    }
    
});