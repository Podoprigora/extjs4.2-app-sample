Ext.define("App.view.bids.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.BidEditorFormPanel",
    
    autoScroll : true,
    bodyCls : 'x-container-body',
    config : {
        bidId : null,
        
        readOnly : false,
        readOnlyContract : false,
        readOnlyTasks : false,
        readOnlyMaterials : false
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        this.plugins = {ptype : 'preservescroll'};
        this.tbar = this.buildTbar();
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick', 'cancelbtnclick', 'updateslogbtnclick');
    },

    buildItems : function() {
        return [
           {
                xtype : 'container',
                layout : {
                    type : 'hbox'
                },
                defaults : {
                    flex : 1,
                    xtype : 'container',
                    layout : 'anchor'
                },
                items : [
                    {
                        padding : 15,
                        minWidth : 730,
                        items : [
                            {
                                xtype : 'hidden',
                                name : 'id'
                            },
                            {
                                xtype : 'fieldcontainer',
                                anchor : '100%',
                                layout : 'hbox',
                                margin : '0 0 8 0',
                                items : [
                                    {
                                        xtype : 'hidden',
                                        name : 'area_code_id'
                                    },
                                    {
                                        xtype : 'AreaCodesListField',
                                        store : Ext.create('App.store.settings.users.AreaCodesStore'),
                                        name : 'area_code',
                                        fieldLabel : 'Код территории',
                                        emptyText : 'Выберите код територии проведения работы',
                                        labelWidth : 105,
                                        tabIndex : 10,
                                        allowBlank : false,
                                        readOnly : this.readOnly,
                                        flex : 1,
                                        listeners : {
                                            scope : this,
                                            select : function(field, record){
                                                field.setValue(record.get('code'));
                                                field.previousSibling('hidden').setValue(record.get('id'));
                                                
                                                this.onInitAreaCodeDependentComponents(record.get('code'));
                                                this.setShopDetailsFields(null); 
                                            },
                                            clearfield : function(field){
                                                field.previousSibling('hidden').reset();
                                                this.onInitAreaCodeDependentComponents(null);
                                                this.setShopDetailsFields(null); 
                                            }
                                        }
                                    },
                                    {
                                        xtype : 'hidden',
                                        name : 'warehouse_id'
                                    },
                                    {
                                        xtype : 'UserAvailableWarehousesListField',
                                        name : 'warehouse',
                                        fieldLabel : 'Склад',
                                        emptyText : 'Выберите операционный склад',
                                        allowBlank : false,
                                        readOnly : this.readOnly,
                                        labelAlign : 'right',
                                        flex : 1,
                                        tabIndex : 11,
                                        listeners : {
                                            scope : this,
                                            select : function(field, record){
                                                field.setValue(record.get('code') + " - " + record.get('city'));
                                                field.previousSibling('hidden').setValue(record.get('id'));
                                            },
                                            clearfield : function(field){
                                                field.previousSibling('hidden').reset();
                                            }
                                        }
                                    }
                                ]
                            
                            },
                            {
                                xtype : 'fieldset',
                                title : 'Данные торговой точки',
                                anchor : '100%',
                                border : false,
                                defaults : {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    defaults : {
                                        xtype : 'textfield',
                                        readOnly : this.readOnly,
                                        flex : 1
                                    }   
                                },
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'hidden',
                                                name : 'shop_id'
                                            },
                                            {
                                                xtype : 'BidsDirectoryShopsListField',
                                                name : 'shop',
                                                fieldLabel : 'Торговая точка',
                                                emptyText : 'Выберите, или заполните данные точки вручную',
                                                disabled : true,
                                                labelWidth : 105,
                                                tabIndex : 12,
                                                //margin : '0 0 8 0',
                                                readOnly : this.readOnly,
                                                listeners : {
                                                    scope : this,
                                                    select : function(field, record) {
                                                        field.setValue(record.get('code') + ' - ' + record.get('name'));
                                                        field.previousSibling('hidden').setValue(record.get('id'));
                                                        
                                                        this.setShopDetailsFields(record);
                                                    },
                                                    clearfield : function(field) {
                                                        field.previousSibling('hidden').reset();
                                                        this.setShopDetailsFields(null);    
                                                    }
                                                }
                                            },
                                            {
                                                xtype  :'combo',
                                                store : Ext.create("App.store.bids.directories.SalesChannelsStore"),
                                                valueField : 'code',
                                                displayField : 'name',
                                                fieldLabel : 'Канал сбыта',
                                                name : 'shop_rka',
                                                editable : false,
                                                labelAlign : 'right',
                                                allowBlank : false,
                                                tabIndex : 17
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                fieldLabel : 'Код',
                                                name : 'shop_code',
                                                labelWidth : 105,
                                                allowBlank : false,
                                                tabIndex : 14
                                            },
                                            {
                                                fieldLabel : 'Город',
                                                name : 'shop_city',
                                                labelAlign : 'right',
                                                allowBlank : false,
                                                tabIndex : 18
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                fieldLabel : 'Наименование',
                                                name : 'shop_name',
                                                labelWidth : 105,
                                                allowBlank : false,
                                                tabIndex : 15
                                            },
                                            {
                                                fieldLabel : 'Адрес',
                                                labelAlign : 'right',
                                                name : 'shop_address',
                                                allowBlank : false,
                                                tabIndex : 19
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                fieldLabel : 'Юр. лицо',
                                                name : 'shop_legal_name',
                                                labelWidth : 105,
                                                tabIndex : 16
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                fieldLabel : 'Местоположение',
                                                labelAlign : 'right',
                                                labelWidth : 115,
                                                layout : 'hbox',
                                                items : [
                                                    {
                                                
                                                        xtype : 'uxTriggerField',
                                                        trigger1Cls: 'x-form-place-trigger',
                                                        name : 'shop_geo',
                                                        emptyText : 'Укажите координаты',
                                                        editable : false,
                                                        readOnly : this.readOnly,
                                                        flex : 1,
                                                        tabIndex : 20,
                                                        listeners : {
                                                            scope : this,
                                                            triggerclick : function(field){
                                                                this.fireEvent('choicelocationbtnclick', this); 
                                                            },
                                                            focus : function(field) {
                                                                this.fireEvent('choicelocationbtnclick', this);    
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : 'Контакт',
                                        name : 'shop_contact',
                                        labelWidth : 105,
                                        anchor : '100%',
                                        tabIndex : 21,
                                        readOnly : this.readOnly
                                    }
                                ]
                            },
                            {
                                xtype : 'fieldset',
                                title : 'Данные договора',
                                anchor : '100%',
                                border : false,
                                defaults : {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    defaults : {
                                        flex : 1,
                                        readOnly : this.readOnlyContract
                                    } 
                                },
                                items : [
                                    {
                                        items : [
                                            {
                                                xtype : 'container',
                                                layout : 'hbox',
                                                defaults : {
                                                    flex : 1,
                                                    readOnly : this.readOnlyContract
                                                },
                                                items : [
                                                    {
                                                        xtype : 'textfield',
                                                        name : 'contract_code',
                                                        fieldLabel : 'Номер',
                                                        labelWidth : 105,
                                                        minWidth : 190,
                                                        tabIndex : 200
                                                    },
                                                    {
                                                        xtype : 'datefield',
                                                        name : 'contract_date',
                                                        fieldLabel : 'Дата',
                                                        labelAlign : 'right',
                                                        labelWidth : 45,
                                                        tabIndex : 201
                                                    }
                                                ]
                                            },
                                            {
                                                xtype : 'textfield',
                                                name : 'contract_city',
                                                fieldLabel : 'Город',
                                                emptyText : 'Введите город подписания договора',
                                                labelAlign : 'right',
                                                tabIndex : 202
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'hidden',
                                                name : 'contract_company_person_fio'
                                            },
                                            {
                                                xtype : 'BidsDirectoryTrusteesListField',
                                                name : 'contract_company_person',
                                                fieldLabel : 'Компания в лице',
                                                emptyText : 'должность, ФИО (родительный пад.)',
                                                labelWidth : 105,
                                                disabled : true,
                                                tabIndex : 203,
                                                listeners : {
                                                    scope : this,
                                                    select : function(field, record) {
                                                        field.setValue(record.get('position') + ", " + record.get('fio2'));
                                                        this.getForm().findField('contract_company_basis').setValue(record.get('basis'));
                                                        this.getForm().findField('contract_company_person_fio').setValue(record.get('fio1'));
                                                    },
                                                    clearfield : function(field) {
                                                        this.getForm().findField('contract_company_basis').reset();
                                                        this.getForm().findField('contract_company_person_fio').reset();
                                                    }
                                                }
                                            },
                                            {
                                                xtype : 'textfield',
                                                name : 'contract_client_person',
                                                fieldLabel : 'Клиент в лице',
                                                emptyText : 'должность, ФИО (родительный пад.)',
                                                labelAlign : 'right',
                                                tabIndex : 205
                                            }
                                        ]
                                    },
                                    {
                                        items : [
                                            {
                                                xtype : 'textarea',
                                                name : 'contract_company_basis',
                                                fieldLabel : 'Основание',
                                                emptyText : 'родительный пад. ',
                                                labelWidth : 105,
                                                margin : '0 0 2 0',
                                                height : 60,
                                                tabIndex : 204
                                            },
                                            
                                            {
                                                xtype : 'textarea',
                                                name : 'contract_client_basis',
                                                fieldLabel : 'Основание',
                                                emptyText : 'родительный пад. ',
                                                labelAlign : 'right',
                                                margin : '0 0 2 0',
                                                height : 60,
                                                tabIndex : 206
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                xtype : 'BidTasksEditorGridPanel',
                                store : Ext.create('App.store.bids.BidTasksLocalStore'),
                                itemId : 'tasksGrid',
                                title : 'Задачи',
                                ui : 'in-form',
                                autoHeight : 'true',
                                minHeight : 200,
                                anchor : '100%',
                                tabIndex : 300,
                                margin : '-5 0 0 0',
                                readOnly : this.readOnlyTasks,
                                readOnlyMaterials : this.readOnlyMaterials
                            },
                            {
                                xtype : 'BidMaterialsEditorGridPanel',
                                store : Ext.create('App.store.bids.BidMaterialsLocalStore'),
                                itemId : 'materialsGrid',
                                title : 'Материалы',
                                ui : 'in-form',
                                autoHeight : 'true',
                                minHeight : 200,
                                margin : '5 0 0 0',
                                anchor : '100%',
                                tabIndex : 301,
                                readOnly : this.readOnlyMaterials
                            }
                        ]
                    },
                    {
                        padding : '15 15 15 5',
                        items : [
                            {
                                xtype : 'textfield',
                                name : 'needtime',
                                fieldLabel : 'Время выполнения',
                                emptyText : 'Введите желаемое время выполнения',
                                anchor : '100%',
                                labelWidth : 120,
                                tabIndex : 400,
                                readOnly : this.readOnly
                            },
                            {
                                xtype : 'textarea',
                                name : 'comments',
                                fieldLabel : 'Комментарии',
                                emptyText : 'Введите комментарии к проводимой работе',
                                labelAlign : 'top',
                                defaultValue : '',
                                anchor : '100%',
                                height : 150,
                                tabIndex : 401,
                                readOnly : this.readOnly
                            },
                            {
                                xtype : 'FilesEditorGridPanel',
                                uploadUrl : Settings.urls.getUrl('bids.files.upload'),
                                downloadUrl : Settings.urls.getUrl('bids.files.download'),
                                itemId : 'filesGrid',
                                title : 'Файлы',
                                border : false,
                                ui : 'in-form',
                                autoHeight : true,
                                minHeight : 120,
                                anchor : '100%',
                                tabIndex : 500,
                                readOnly : this.readOnly
                            }
                        ]
                    }
                ]
            }   
        ];
    },
    
    buildTbar : function() {
        return [
            {
                text : 'Сохранить',
                itemId : 'btnSave',
                iconCls : 'icon-save',
                scope : this,
                handler : function() {
                    this.fireEvent('savebtnclick', this);
                }
            },
            {
                text : 'Отмена',
                scope : this,
                handler : function() {
                    this.fireEvent('cancelbtnclick', this);
                }
            },
            {
                text : 'История изменений',
                itemId : 'btnHistory',
                iconCls : 'icon-history',
                hidden : true,
                scope : this,
                handler : function() {
                    this.fireEvent('updateslogbtnclick', this);    
                }   
            }
        ];
    },
    
    setShopDetailsFields : function(record) {
        var basicForm = this.getForm(),
            me
        if (Ext.isEmpty(record) == false) {
            basicForm.findField('shop_code').setValue(record.get('code'));
            basicForm.findField('shop_name').setValue(record.get('name'));
            basicForm.findField('shop_legal_name').setValue(record.get('legal_name'));
            basicForm.findField('shop_city').setValue(record.get('city'));
            basicForm.findField('shop_address').setValue([record.get('address1'), record.get('address2')].join(", ").replace(/,\s*$/, ""));
            basicForm.findField('shop_geo').setValue(record.get('gps').replace(",",";"));
            basicForm.findField('shop_contact').setValue(record.get('contact'));
            basicForm.findField('shop_rka').setValue(record.get('rka'));
            basicForm.findField('shop_rka').store.load();
        } else {
            Ext.defer(function(){
                var shopFields = null; 
                if(Ext.isEmpty((shopFields = this.query('textfield[name^=shop_]'))) == false) {
                    for(var i in shopFields) {
                        shopFields[i].reset();
                    }   
                }
            }, 50, this);
        }
    },
    
    onInitAreaCodeDependentComponents : function(areaCode){
        var shoplListField = this.down('BidsDirectoryShopsListField'),
            trusteesListField = this.down('BidsDirectoryTrusteesListField');
            
        shoplListField.reset();
        trusteesListField.reset();
        
        if (Ext.isEmpty(areaCode) == false) {
            shoplListField.getStore().addFilter('area_code', areaCode);
            shoplListField.setDisabled(false);
                                        
            trusteesListField.getStore().addFilter('area_code', areaCode);
            trusteesListField.setDisabled(false);
            
            this.down('#tasksGrid').down('#btnAddTask').setDisabled(false);
        } else {
            shoplListField.setDisabled(true);
            trusteesListField.setDisabled(true);

            this.down('#tasksGrid').down('#btnAddTask').setDisabled(true);
        }  
    }
});
