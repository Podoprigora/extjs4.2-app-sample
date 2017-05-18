Ext.define("App.view.settings.users.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.UserEditorFormPanel",
    
    config : {
        userId : null
    },
    
    containerScroll : true,
    overflowX : 'hidden',
    overflowY : 'scroll',
    
    bodyPadding : '5 25 5 5',
    border : false,
    bodyCls : 'x-container-body',
    
    layout : {
        type : 'hbox',
        align : 'top'
    },
    
    initComponent : function(){
        
        this.items = this.builditems();
        this.tbar = this.buildButtons();
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick', 'cancelbtnclick', 'changerolefield');
    },
    
    builditems : function() {
        return [
            {
                xtype : 'form',
                itemId : 'userForm',
                padding : 10,
                border : false,
                bodyCls : 'x-container-body',
                width : 400,
                defaults : {
                    anchor : '100%'
                },
                items : [
                    {
                        xtype : 'hidden',
                        name : 'id'
                    },
                    {
                        xtype : 'combo',
                        store : Ext.create('App.store.settings.users.StatusesLocalStore'),
                        fieldLabel : 'Статус',
                        displayField : 'name',
                        valueField : 'id',
                        name : 'is_active',
                        editable : false,
                        allowBlank : false,
                        cls : 'label-bold',
                        listeners : {
                            scope : this,
                            change : function(fl, value){
                                var record = fl.getStore().findRecord('id', value);
                                if (record) {
                                    fl.setFieldStyle('background:' + record.get('color'));    
                                }
                            }
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Фамилия',
                        name : 'last_name',
                        allowBlank : false
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Имя',
                        name : 'first_name',
                        allowBlank : false
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : 'Отчество',
                        name : 'patronymic'
                    },
                    {
                        xtype : 'uxCombo',
                        name : 'region_id',
                        store : Ext.create('App.store.settings.regions.RegionsStore',{
                            filters : [
                                {property : 'dependent_access', value : true}
                            ]
                        }),
                        fieldLabel : 'Привязка',
                        allowBlank : false,
                        editable : false,
                        enableReset : true
                    },
                    {
                        xtype : 'fieldset',
                        title : 'Параметры авторизации',
                        margin : '8 0 0 0',
                        defaults : {
                            anchor : '100%'
                        },
                        items : [
                            {
                                xtype : 'uxGroupingCombo',
                                name : 'role_id',
                                fieldLabel : 'Роль',
                                groupField : 'group_name',
                                store : Ext.create('App.store.settings.roles.RolesStore')
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Логин',
                                name : 'login',
                                vtype : 'email',
                                allowBlank : false
                            },
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        fieldLabel : 'Пароль',
                                        inputType : 'password',
                                        name : 'password',
                                        allowBlank : false,
                                        flex : 1
                                    },
                                    {
                                        xtype : 'button',
                                        iconCls : 'icon-eye',
                                        tooltip : 'Просмотр',
                                        height : 24,
                                        margin : '0 0 0 5',
                                        scope : this,
                                        handler : this.onShowPassword
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Внешний ID',
                                name : 'outer_id'
                            }
                        ]
                    },
                    {
                        xtype : 'fieldset',
                        title : 'Контакты',
                        defaults : {
                            anchor : '100%'
                        },
                        items : [
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Email',
                                name : 'email',
                                vtype : 'email'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Телефон 1',
                                name : 'phone1'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : 'Телефон 2',
                                name : 'phone2'
                            }
                        ]
                    },
                    {
                        xtype : 'fieldset',
                        title : 'Паспортные данные',
                        defaults : {
                            anchor : '100%'
                        },
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                layout : 'hbox',
                                fieldLabel : 'Паспорт',
                                items : [
                                    {
                                        xtype : 'textfield',
                                        name : 'pass_series',
                                        emptyText : 'Серия',
                                        maskRe: /\d/,
                                        maxLength : 4,
                                        width : 60
                                    },
                                    {
                                        xtype : 'textfield',
                                        name : 'pass_code',
                                        emptyText : 'Номер',
                                        maskRe: /\d/,
                                        maxLength : 6,
                                        flex : 1,
                                        margin : { left : 10 }
                                    }
                                ]
                            },
                            {
                                xtype : 'datefield',
                                name : 'pass_date',
                                fieldLabel : 'Дата выдачи'
                            },
                            {
                                xtype : 'textarea',
                                name : 'address',
                                fieldLabel : 'Адрес',
                                height : 50
                            }      
                        ]
                    }
                ]
            },
            {
                xtype : 'container',
                flex : 1,
                maxWidth : 800,
                minWidth : 400,
                margin : '0 0 0 5',
                defaults : {
                    autoHeight : true,
                    ui : 'in-form'
                },
                items : [
                    {
                        xtype : 'UserAreaCodesEditorGridPanel',
                        itemId : 'areaCodesGrid',
                        title : 'Региональные коды',
                        minHeight : 160,
                        margin : '0 0 10 0'
                    },
                    {
                        xtype : 'UserAccessAreasEditorGridPanel',
                        itemId : 'accessAreasGrid',
                        title : 'Зона ответственности',
                        minHeight : 200
                    }
                ]
            }
        ];
    },
    
    buildButtons : function() {
        return [
            {
                text : 'Сохранить и создать',
                iconCls : 'icon-save',
                tooltip : 'Сохранение и очистка формы для добавления новой записи',
                scope : this,
                handler : function() {
                    this.fireEvent('savebtnclick', this);
                }
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
                text : 'Отмена',
                scope : this,
                handler : function() {
                    this.fireEvent('cancelbtnclick', this);
                }
            }
        ];
    },
    
    onChangeRoleField : function(field, value) {
        if (value) {
            this.fireEvent('changerolefield', this, value);
        }
    },
    
    onShowPassword : function() {
        var value = Ext.valueFrom(this.getForm().findField('password').getValue(), '[не задан]')
        App.ux.Msg.info(Ext.String.format("Пароль: <b>{0}</b>", value));
    }
});