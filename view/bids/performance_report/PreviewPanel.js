Ext.define("App.view.bids.performance_report.PreviewPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.BidPerformanceReportPreviewPanel",
    
    config : {
        bidId : null,
        bidRecord : null
    },
    
    layout : {
        type : 'card',
        deferredRender : false,
        forceLayout : true
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('createbtnclick', 'editbtnclick', 'deletebtnclick');
    },
    
    buildItems : function(){
        return [
            {
                xtype : 'panel',
                border : false,
                tbar : [
                    {
                        text : 'Добавить отчет',
                        iconCls : 'icon-create',
                        scope : this,
                        handler : function(){
                            this.fireEvent('createbtnclick', this);
                        }
                    }
                ]
            },
            {
                xtype : 'form',
                itemId : 'previewForm',
                border : false,
                bodyPadding : 15,
                bodyCls : 'x-container-body',
                autoScroll : true,
                defaults : {
                    readOnly : true
                },
                dockedItems : [
                    {
                        xtype : 'toolbar',
                        itemId : 'toolbar',
                        dock : 'top',
                        items : [
                            {
                                text : 'Редактировать отчет',
                                iconCls : 'icon-edit',
                                scope : this,
                                handler : function(){
                                    this.fireEvent('editbtnclick', this);
                                }
                            }
                        ]
                    }
                ],
                items : [
                    {
                        xtype : 'fieldcontainer',
                        layout : 'hbox',
                        defaults : {
                            readOnly : true
                        },
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'completed_date',
                                fieldLabel : 'Дата выполнения',
                                labelWidth : 110,
                                width : 220
                            },
                            {
                                xtype : 'textfield',
                                name : 'user',
                                fieldLabel : 'Исполнитель',
                                labelAlign : 'right',
                                flex : 1
                            }
                        ]
                    },
                    {
                        xtype : 'BidPerformanceReportTasksEditorGridPanel',
                        itemId : 'tasksGrid',
                        ui : 'in-form',
                        title : 'Задачи',
                        minHeight : 150,
                        autoHeight : true
                    },
                    {
                        xtype : 'panel',
                        bodyCls : 'x-container-body',
                        ui : 'in-form',
                        title : 'Комментарии',
                        anchor : '100%',
                        layout : 'anchor',
                        autoHeight : true,
                        border : false,
                        items : [
                            {
                                xtype : 'textarea',
                                name : 'comment',
                                anchor : '100%',
                                grow : true,
                                readOnly : true
                            }
                        ]
                    },
                    {
                        xtype: "ImagesEditorPanel",
                        uploadUrl : Settings.urls.getUrl('bids.performance_report.upload_image'),
                        previewUrl : Settings.urls.getUrl('bids.performance_report.preview_image'),
                        itemId: "imagesPanel",
                        title : 'Фото',
                        ui: "in-form",
                        autoHeight: true,
                        minHeight : 300
                    }   
                ]
            }
        ]  
    }
    
});