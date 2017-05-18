Ext.define("App.view.plan.shops.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.ShopEditorFormPanel",
    
    config: {
        shopId: null,
        scrollPreservedPos : 0
    },
    
    layout : 'hbox',
    overflowX : 'hidden',
    overflowY : 'scroll',
    bodyCls : 'x-container-body',
    
    readOnly : false,
    
    defaults : {
        bodyCls : 'x-container-body',
        border : false,
        flex : 1
    },
    
    initComponent: function () {
        this.items = this.buildItems();
        this.plugins = {ptype : 'preservescroll'};
        
        if (this.readOnly == false) {
            this.dockedItems = [this.buildTbar()];
        }
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick", "cancelbtnclick", "activationbtnclick", "requestreportbtnclick");
    },
    
    buildItems: function () {
        
        return [
            {
                xtype : 'container'
            },
            {
                layout : 'anchor',
                minWidth : App.Properties.get('minViewWidth'),
                bodyPadding: '15 5 0 5',
                items : [
                    {
                        border: false,
                        bodyCls : 'x-container-body',
                        layout: {
                            type: "hbox"
                        },
                        defaults : {
                            layout : 'anchor',
                            bodyCls : 'x-container-body',
                            border : false
                        },
                        items: [
                            {
                                flex : 1,
                                defaults : {
                                    readOnly : this.readOnly,
                                    bodyCls : 'x-container-body',
                                    labelWidth : 105
                                },
                                items: [
                                    {
                                        xtype: "hidden",
                                        name: "id"
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        layout : 'hbox',
                                        defaults : {
                                            readOnly : this.readOnly
                                        },
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
                                                width : 220,
                                                labelWidth : 105,
                                                allowBlank: false,
                                                listeners : {
                                                    scope : this,
                                                    select : function(field, record){
                                                        field.setValue(record.get('code'));
                                                        field.previousSibling('hidden').setValue(record.get('id'));
                                                    },
                                                    clearfield : function(field){
                                                        field.previousSibling('hidden').reset();
                                                    }
                                                }
                                            },
                                            {
                                                xtype: "textfield",
                                                name: "code",
                                                fieldLabel: "Код точки",
                                                labelAlign : 'right',
                                                labelWidth : 80,
                                                allowBlank: false,
                                                flex : 1
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'uxCombo',
                                        store : Ext.create('App.store.settings.regions.RegionsStore'),
                                        name : 'region_id',
                                        fieldLabel : 'Регион',
                                        enableReset : true,
                                        anchor : '100%'
                                    },
                                    {
                                        xtype: "textfield",
                                        name: "name",
                                        fieldLabel: "Наименование",
                                        anchor: "100%",
                                        allowBlank: false
                                    },
                                    {
                                        xtype: "textfield",
                                        name: "address",
                                        fieldLabel: "Адрес",
                                        anchor: "100%",
                                        allowBlank: false
                                    },
                                    {
                                        xtype : 'fieldcontainer',
                                        fieldLabel : 'Время работы',
                                        labelSeparator : '',
                                        layout : 'hbox',
                                        defaults: {
                                            increment: 30,
                                            format: "H:i",
                                            width: 100,
                                            //labelWidth: 75,
                                            readOnly : this.readOnly
                                        },
                                        items: [
                                            {
                                                xtype: "timefield",
                                                name: "start_time",
                                                emptyText: "Начало"
                                            },
                                            {
                                                xtype: "timefield",
                                                name: "end_time",
                                                emptyText : "Окончание",
                                                margin : '0 0 0 5'
                                            }
                                        ]
                                    },
                                    {
                                        xtype: "textarea",
                                        name: "comment",
                                        fieldLabel : 'Комментарий',
                                        anchor: "100%",
                                        height: 80,
                                        //margin: "0 0 0 0",
                                        readOnly : this.readOnly
                                    },
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : 'Дата активации',
                                        name : 'activated',
                                        labelWidth : 150,
                                        readOnly : true,
                                        hidden : this.readOnly,
                                        anchor : '100%',
                                        //margin : '10 0 0 0',
                                        listeners : {
                                            scope : this,
                                            single : true,
                                            change : function(field, value) {
                                                field.setRawValue(Ext.Date.format(new Date(value), "d.m.Y H:i:s"));
                                            }
                                        }
                                    },
                                    {
                                        xtype  :'textfield',
                                        fieldLabel : 'Дата последнего ответа',
                                        name : 'last_equipment_response',
                                        labelWidth : 150,
                                        readOnly : true,
                                        hidden : this.readOnly,
                                        anchor : '100%',
                                        listeners : {
                                            scope : this,
                                            single : true,
                                            change : function(field, value) {
                                                field.setRawValue(Ext.util.Format.date(value, "d.m.Y H:i:s"));
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                width : 500,
                                margin: {
                                    left: 15
                                },
                                defaults : {
                                    anchor : '100%'
                                },
                                hidden : this.readOnly,
                                items: [
                                    {
                                        xtype: "fieldset",
                                        title: "Параметры доступа",
                                        border : false,
                                        //margin : '8 0 0 0',
                                        items: [
                                            {
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype : 'uxCombo',
                                                        store : Ext.create('App.store.plan.ShopEquipmentTypesLocalStore'),
                                                        name : 'equipment_type',
                                                        fieldLabel : 'Тип устройства',
                                                        editable : false,
                                                        allowBlank : false,
                                                        anchor : '50%',
                                                        listeners : {
                                                            scope : this,
                                                            change : this.onChangeEquipmentType
                                                        }
                                                    }, 
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_service_phone",
                                                        fieldLabel: "Сервисный номер",
                                                        labelAlign : 'right',
                                                        labelWidth : 120,
                                                        allowBlank : false,
                                                        plugins : [
                                                            new App.ux.form.plugins.InputTextMask('+99999999999')
                                                        ]
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype: "textfield",
                                                        name: "phone",
                                                        fieldLabel: "Логин",
                                                        allowBlank : false,
                                                        plugins : [
                                                            new App.ux.form.plugins.InputTextMask('+99999999999')
                                                        ]
                                                    }, 
                                                    {
                                                        xtype: "textfield",
                                                        name: "password",
                                                        fieldLabel: "Пароль",
                                                        labelAlign : 'right',
                                                        labelWidth : 120
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                itemId : 'fcEquipmentModeBox1',
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                hidden : true,
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype : 'uxCombo',
                                                        store : Ext.create('App.store.plan.ShopEquipmentModeLocalStore'),
                                                        name : 'equipment_mode',
                                                        fieldLabel: "Режим работы",
                                                        editable : false,
                                                        allowBlank : false,
                                                        listeners : {
                                                            scope : this,
                                                            change : this.onChangeEquipmentMode
                                                        }
                                                    }, 
                                                    {
                                                        xtype : 'uxCombo',
                                                        store : Ext.create('App.store.plan.ShopEquipmentReportPeriodsLocalStore'),
                                                        name : 'equipment_report_periods',
                                                        fieldLabel: "Получ. отчета",
                                                        editable : false,
                                                        allowBlank : false,
                                                        labelAlign : 'right',
                                                        labelWidth : 120
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                itemId : 'fcEquipmentModeBox2',
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                hidden : true,
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_host",
                                                        fieldLabel: "Host"
                                                    }, 
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_gate",
                                                        fieldLabel: "Gate",
                                                        labelAlign : 'right',
                                                        labelWidth : 120
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                itemId : 'fcEquipmentModeBox3',
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                hidden : true,
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_gprs_username",
                                                        fieldLabel: "GPRS username"
                                                    }, 
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_gprs_pass",
                                                        fieldLabel: "GPRS password",
                                                        labelAlign : 'right',
                                                        labelWidth : 120
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                itemId : 'fcEquipmentModeBox4',
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                hidden : true,
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype: "textfield",
                                                        name: "equipment_apn",
                                                        fieldLabel: "APN"
                                                    }, 
                                                    {
                                                        xtype: "numberfield",
                                                        name: "equipment_mtu",
                                                        fieldLabel: "MTU",
                                                        labelAlign : 'right',
                                                        labelWidth : 120
                                                    }
                                                ]
                                                
                                            },
                                            {
                                                itemId : 'fcEquipmentModeBox5',
                                                xtype : 'fieldcontainer',
                                                layout : 'hbox',
                                                hidden : true,
                                                defaults : {
                                                   flex : 1,
                                                   readOnly : this.readOnly
                                                },
                                                items : [
                                                    {
                                                        xtype: "hidden",
                                                        name: "script_id"
                                                    },
                                                    {
                                                        xtype: "ScriptsListField",
                                                        name: "script_name",
                                                        fieldLabel: "Скрипт",
                                                        enableReset : true,
                                                        listeners : {
                                                            scope : this,
                                                            select : function(field, record){
                                                                field.setValue(record.get('name'));
                                                                field.previousSibling('hidden').setValue(record.get('id'));
                                                            },
                                                            clearfield : function(field){
                                                                field.previousSibling('hidden').reset();
                                                            }
                                                        }
                                                    }, 
                                                    {
                                                        xtype : 'label'
                                                    }
                                                ]
                                                
                                            }
                                        ]
                                    },
                                    {
                                        xtype : 'checkboxfield',
                                        itemId : 'chSendActivationSms',
                                        boxLabel : 'Активировать устройство',
                                        name : 'send_activation_sms',
                                        cls : 'label-bold',
                                        margin : '0 0 5 0',
                                        hidden : true
                                    },
                                    {
                                        xtype : 'checkboxfield',   
                                        boxLabel : 'Отключить мониторинг',
                                        name : 'is_disabled',
                                        //margin : '5 0 0 0',
                                        hidden : this.readOnly
                                    },
                                    {
                                        xtype : 'checkboxfield',   
                                        boxLabel : 'Отключить мониторинг низкого баланса SIM карты',
                                        name : 'is_disabled_check_balance',
                                        margin : '5 0 5 0',
                                        hidden : this.readOnly
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        title: "Выкладки",
                        xtype: "ShopPlanogramsEditorGridPanel",
                        itemId: "planogramsGrid",
                        ui: "in-form",
                        minHeight : 150,
                        autoHeight : true,
                        readOnly : this.readOnly
                    },
                    {
                        title : 'Отчеты',
                        xtype  :'PlanShopReportGridPanel',
                        itemId : 'reportsGrid',
                        ui : 'in-form',
                        margin: "10 0 0 0",
                        autoHeight : true,
                        minHeight : 150,
                        readOnly : this.readOnly
                    },
                    {
                        title : 'Все изображения',
                        xtype: "ImagesEditorPanel",
                        uploadUrl : Settings.urls.getUrl('plan.shops.upload_image'),
                        previewUrl : Settings.urls.getUrl('plan.shops.preview_image'),
                        itemId: "imagesPanel",
                        ui: "in-form",
                        margin: "15 0 25 0",
                        autoHeight: true,
                        minHeight : 200,
                        itemWidth : 140,
                        itemHeight : 160,
                        readOnly : this.readOnly
                    }
                ]
            },
            {
                xtype  :'container'
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
                    layout : 'hbox',
                    items : [
                        {
                            text : 'Сохранить и создать',
                            iconCls : 'icon-save',
                            tooltip : 'Сохранение и очистка формы для добавления новой записи',
                            scope : this,
                            handler : function() {
                                this.fireEvent('savebtnclick', this, 'create');
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
                            handler : function() {
                                this.fireEvent('cancelbtnclick', this)
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            flex : 1
                        },
                        {
                            text : 'Управление устройством',
                            itemId : 'btnManageEquipment',
                            iconCls : 'icon-gear-orange',
                            hidden : true,
                            menu : [
                                {
                                    text : 'Активировать',
                                    itemId : 'btnActivation',
                                    scope : this,
                                    handler : function() {
                                        this.fireEvent('activationbtnclick', this);
                                    }
                                    
                                },
                                '-',
                                {
                                    text : 'Перезагрузка',
                                    itemId : 'btnRequestReboot1',
                                    scope : this,
                                    handler : function(btn){
                                        this.fireEvent('requestrebootbtnclick', this, 1);
                                    }
                                },
                                {
                                    text : 'Сброс и перезагрузка',
                                    itemId : 'btnRequestReboot2',
                                    scope : this,
                                    handler : function(btn){
                                        this.fireEvent('requestrebootbtnclick', this, 2);
                                    }
                                },
                                '-',
                                {
                                    text : 'Внеочередной отчет',
                                    itemId : 'btnRequestReport',
                                    scope : this,
                                    handler : function() {
                                        this.fireEvent('requestreportbtnclick', this);
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    xtype : 'container'
                }
            ]
        };
    },
    
    onChangeEquipmentType : function(field, value) {
        var form = this.getForm();
        
        if (this.readOnly == false) {
            this.down('#btnRequestReboot1').setDisabled((value == 1));
            this.down('#btnRequestReboot2').setDisabled((value == 1));
            
            form.findField('phone').setFieldLabel((value == 2) ? 'Логин/тел.' : 'Логин');
            form.findField('password').setFieldLabel((value == 2) ? 'Пароль/IMEI' : 'Пароль');
            
            this.down('#fcEquipmentModeBox1').setVisible((value == 2));
            this.down('#fcEquipmentModeBox5').setVisible((value == 2));
            if (value == 2) {
                form.findField('equipment_mode').setValue(1);
                form.findField('equipment_report_periods').setValue(2);
            } else {
                form.findField('equipment_mode').setValue(2);   
            }    
        }
    },
    
    onChangeEquipmentMode : function(field, value) {
        if (this.readOnly == false) {
            this.down('#fcEquipmentModeBox2').setVisible((value == 1));
            this.down('#fcEquipmentModeBox3').setVisible((value == 1));
            this.down('#fcEquipmentModeBox4').setVisible((value == 1));    
        }
    }
    
});