Ext.define("App.view.bids.performance_report.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.BidPerformanceReportEditorFormPanel",
    
    config : {
        bidId : null
    },
    
    overflowX : 'hidden',
    overflowY : 'scroll',
    bodyCls : 'x-container-body',
    
    layout : {
        type : 'hbox'
    },
    defaults : {
        flex : 1,
        border : false,
        bodyCls : 'x-container-body'
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.dockedItems = [this.buildTbar()];
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick', 'cancelbtnclick');
    },
    
    buildItems : function(){
        
        return [
            {
                xtype : 'container'  
            },
            {
                layout : 'anchor',
                minWidth : App.Properties.get('minViewWidth'),
                bodyPadding : 15,
                items : [
                    {
                        xtype : 'hidden',
                        name : 'id'
                    },
                    {
                        xtype : 'hidden',
                        name : 'bid_id'
                    },
                    
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        defaults : {
                            allowBlank : false
                        },
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'completed_date',
                                fieldLabel : 'Дата выполнения',
                                labelWidth : 110,
                                width : 220,
                                allowBlank : false
                            },
                            {
                                xtype : 'hidden',
                                name : 'user_id'
                            },
                            {
                                xtype : 'UsersListField',
                                store : Ext.create('App.store.settings.users.PerformersStore'),
                                name : 'user',
                                fieldLabel : 'Исполнитель',
                                emptyText : 'Выберите пользователя',
                                labelAlign : 'right',
                                width : 400,
                                listeners : {
                                    scope : this,
                                    select : function(field, record) {
                                        field.setValue(record.get('fio'));
                                        field.previousSibling('field[name=user_id]').setValue(record.get('id'));
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'BidPerformanceReportTasksEditorGridPanel',
                        itemId : 'tasksGrid',
                        ui : 'in-form',
                        title : 'Задачи'
                    },
                    {
                        xtype : 'textarea',
                        name : 'comment',
                        fieldLabel : 'Комментарий',
                        labelAlign : 'top',
                        emptyText : 'Введите текст комментария',
                        height : 120,
                        margin : '0 0 10 0',
                        anchor : '100%'
                    },
                    {
                        xtype: "ImagesEditorPanel",
                        uploadUrl : Settings.urls.getUrl('bids.performance_report.upload_image'),
                        previewUrl : Settings.urls.getUrl('bids.performance_report.preview_image'),
                        itemId: "imagesPanel",
                        ui: "in-form",
                        margin: "15 0 25 0",
                        autoHeight: true,
                        minHeight : 300
                    }
                ]
            },
            {
                xtype : 'container'   
            }
        ];
    },
    
    buildTbar : function() {
        return {
            xtype : 'toolbar',
            dock : 'top',
            layout : 'hbox',
            defaults : {
                flex : 1
            },
            items : [
                {
                    xtype : 'container'
                },
                {
                    xtype : 'buttongroup',
                    minWidth : App.Properties.get('minViewWidth'),
                    items : [
                        {
                            xtype : 'tbspacer',
                            width : 10
                        },
                        {
                            text : 'Сохранить',
                            iconCls : 'icon-save',
                            scope : this,
                            handler : function(){
                                this.fireEvent('savebtnclick', this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text : 'Отмена',
                            scope : this,
                            handler : function() {
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