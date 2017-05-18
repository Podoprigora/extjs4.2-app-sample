Ext.define("App.view.bids.PreviewFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.BidPreviewFormPanel",
    
    title : '-',
    
    autoScroll : true,
    bodyPadding : '10 15 15 15',
    bodyCls : 'x-container-body',
    
    defaults : {
        readOnly : true,
        labelWidth : 130,
        width : 420
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.dockedItems = [this.buildTbar()];
        
        this.callParent(arguments);
        
        this.addEvents('acceptbtnclick', 'rejectbtnclick', 'updateslogbtnclick', 'makepdfbtnclick', 'editbtnclick', 'deletebtnclick');
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'BidAgreementRouteGridPanel',
                itemId : 'agreementRouteGrid',
                title : 'Прогресс согласования заявки',
                border : false,
                ui : 'in-form',
                autoHeight : true,
                minHeight : 80,
                anchor : '100%',
                margin : '0 0 15 0'
            },
            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                
                anchor : '100%',
                defaults : {
                    flex  : 1,
                    readOnly : true
                },
                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Код территории',
                        name : 'area_code',
                        labelWidth : 130
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Склад',
                        name : 'warehouse',
                        labelAlign : 'right'
                    }  
                ]
            },
            {
                xtype : 'textfield',
                name : 'needtime',
                fieldLabel : 'Время выполнения',
                anchor : '100%',
                labelWidth : 130
            },
            {
                xtype : 'fieldset',
                title : 'Данные торговой точки',
                collapsible : true,
                collapsed : false,
                anchor : '100%',
                margin : '10 0 0 0',
                border : false,
                defaults : {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        xtype : 'textfield',
                        flex : 1,
                        readOnly : true
                    }   
                },
                items : [
                    {
                        items : [
                            {
                                fieldLabel : 'Код',
                                name : 'shop_code'
                            },
                            {
                                xtype  :'uxCombo',
                                store : Ext.create("App.store.bids.directories.SalesChannelsStore"),
                                valueField : 'code',
                                fieldLabel : 'Канал сбыта',
                                name : 'shop_rka',
                                labelAlign : 'right'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                fieldLabel : 'Наименование',
                                name : 'shop_name'
                            },
                            {
                                fieldLabel : 'Юр. лицо',
                                labelAlign : 'right',
                                name : 'shop_legal_name'
                            }
                        ]
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Город',
                        name : 'shop_city',
                        anchor : '100%',
                        readOnly : true
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Адрес',
                        name : 'shop_address',
                        anchor : '100%',
                        readOnly : true
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Контакт',
                        name : 'shop_contact',
                        anchor : '100%',
                        readOnly : true
                    }
                ]
            },
            {
                xtype : 'BidTasksEditorGridPanel',
                itemId : 'tasksGrid',
                title : 'Задачи',
                ui : 'in-form',
                disableSelection : true,
                viewConfig : {
                    trackOver : false,
                    stripeRows : false
                },
                autoHeight : 'true',
                minHeight : 120,
                hideHeaders : true,
                anchor : '100%'
            },
            {
                xtype : 'BidMaterialsEditorGridPanel',
                itemId : 'materialsGrid',
                title : 'Материалы',
                ui : 'in-form',
                disableSelection : true,
                viewConfig : {
                    trackOver : false,
                    stripeRows : false
                },
                autoHeight : 'true',
                minHeight : 120,
                hideHeaders : true,
                margin : '10 0 0 0',
                anchor : '100%'
            },
            {
                xtype : 'fieldset',
                title : 'Данные договора',
                collapsible : true,
                collapsed : false,
                anchor : '100%',
                margin : '15 0 0 0',
                border : false,
                defaults : {
                    xtype : 'fieldcontainer',
                    layout : {
                        type : 'hbox'
                    },
                    defaults : {
                        labelAlign : 'top',
                        flex : 1,
                        readOnly : true
                    } 
                },
                items : [
                    {
                        items : [
                            {
                                xtype : 'container',
                                layout : 'hbox',
                                defaults : {
                                    readOnly : true
                                },
                                items : [
                                    {
                                        xtype : 'textfield',
                                        name : 'contract_code',
                                        fieldLabel : 'Номер',
                                        labelWidth : 50,
                                        flex : 1
                                    },
                                    {
                                        xtype : 'datefield',
                                        name : 'contract_date',
                                        fieldLabel : 'Дата',
                                        labelAlign : 'right',
                                        labelWidth : 40,
                                        width : 130
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                name : 'contract_city',
                                fieldLabel : 'Город',
                                labelAlign : 'left',
                                labelWidth : 60,
                                margin : '0 0 0 20'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textarea',
                                name : 'contract_company_person',
                                fieldLabel : 'Компания в лице'
                                
                            },
                            {
                                xtype : 'textarea',
                                name : 'contract_client_person',
                                fieldLabel : 'Клиент в лице',
                                margin : '0 0 0 20'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'textarea',
                                name : 'contract_company_basis',
                                fieldLabel : 'Основание'
                            },
                            
                            {
                                xtype : 'textarea',
                                name : 'contract_client_basis',
                                fieldLabel : 'Основание',
                                margin : '0 0 0 20'
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'panel',
                ui : 'in-form',
                title : 'Комментарии',
                anchor : '100%',
                layout : 'anchor',
                autoHeight : true,
                border : false,
                bodyCls : 'x-container-body',
                minHeight : 100,
                items : [
                    {
                        xtype : 'textarea',
                        name : 'comments',
                        anchor : '100%',
                        grow : true,
                        readOnly : true,
                        minHeight : 80
                    }
                ]
            },
            {
                xtype : 'FilesEditorGridPanel',
                downloadUrl : Settings.urls.getUrl('bids.files.download'),
                itemId : 'filesGrid',
                title : 'Файлы',
                border : false,
                ui : 'in-form',
                autoHeight : true,
                minHeight : 80,
                anchor : '100%'
            }
        ];
    },
    
    buildTbar : function() {
        return {
            xtype : 'toolbar',
            dock : 'top',
            border : true,
            //hidden : true,
            items : [
                {
                    text : 'Подтвердить',
                    itemId : 'btnAccept',
                    iconCls : 'icon-accept',
                    scope : this,
                    handler : function(){
                        this.fireEvent('acceptbtnclick', this);
                    }
                },
                {
                    text : 'Отклонить',
                    itemId : 'btnReject',
                    iconCls : 'icon-reject',
                    scope : this,
                    handler : function(){
                        this.fireEvent('rejectbtnclick', this);
                    }
                },
                {
                    text : 'Документы',
                    iconCls : 'icon-document-pdf',
                    scope : this,
                    handler : function(btn){
                        this.fireEvent('makepdfbtnclick', this);
                    }
                },
                {
                    tooltip : 'Редактировать',
                    itemId : 'btnEdit',
                    iconCls : 'icon-edit',
                    scope : this,
                    handler : function() {
                        this.fireEvent('editbtnclick', this);
                    }
                },
                {
                    tooltip : 'Удалить',
                    iconCls : 'icon-delete',
                    itemId : 'btnDelete',
                    scope : this,
                    handler : function() {
                        this.fireEvent('deletebtnclick', this);
                    }
                }
            ]
        };
    }
});