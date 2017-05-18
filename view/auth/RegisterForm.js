Ext.define('App.view.auth.RegisterForm', {
    extend : 'Ext.form.Panel',
    xtype : 'RegisterForm',
    
    layout : 'anchor',
    bodyPadding : '15 15 12 15',
    bodyCls : 'x-container-body',
    defaults : {
        anchor : '100%',
        labelAlign : 'top',
        msgTarget : 'under'
    },
    
    initComponent : function() {
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'textfield',
                name : 'fio',
                fieldLabel : 'ФИО',
                emptyText : 'Введите фамилию, имя, отчество',
                allowBlank : false
            },
            {
                xtype : 'uxGroupingCombo',
                name : 'role_id',
                fieldLabel : 'Роль',
                store : Ext.create('App.store.settings.roles.RolesStore'),
                groupField : 'group_name',
                emptyText : 'Выберите роль в системе',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                name : 'login',
                fieldLabel : 'E-mail',
                emptyText : 'Введите ваш e-mail',
                vtype : 'email',
                allowBlank : false
            },
            {
                xtype : 'fieldcontainer',
                fieldLabel : 'Пароль',
                layout : 'hbox',
                defaults : {
                    inputType : 'password',
                    allowBlank : false,
                    msgTarget : 'under',
                    flex : 1
                },
                items : [
                    {
                        xtype : 'textfield',
                        name : 'password',
                        emptyText : 'Введите пароль',
                        minLength : 6
                    },
                    {
                        xtype : 'textfield',
                        name : 'password_confirm',
                        emptyText : 'Повторите пароль',
                        margin : '0 0 0 10',
                        listeners : {
                            scope : this,
                            blur : function(field){
                                var passField = this.getForm().findField('password');
                                if (Ext.isEmpty(passField.getValue()) == false 
                                    && Ext.isEmpty(field.getValue()) == false 
                                    && (passField.getValue() != field.getValue())) {
                                    
                                    field.markInvalid('Значение не совпадает!');
                                }
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'textfield',
                name : 'phone',
                fieldLabel : 'Телефон',
                emptyText : 'Введите номер телефона',
                allowBlank : false,
                plugins : [
                    new App.ux.form.plugins.InputTextMask('9(999) 999-99-99')
                ]
            },
            {
                xtype : 'hidden',
                name : 'area_code_id'
            },
            {
                xtype : 'uxListPicker',
                store : Ext.create('App.store.settings.area_codes.CodesStore'),
                dataIndex : 'code',
                hideHeaders : true,
                name : 'area_code',
                fieldLabel : 'Региональный код',
                emptyText : 'Введите региональный код',
                allowBlank : false,
                listWidth : 150,
                listeners : {
                    scope : this,
                    select : function(field, record){
                        field.setValue(record.get('code'));
                        this.getForm().findField('area_code_id').setValue(record.get('id'));   
                    },
                    clearfield : function(){
                        this.getForm().findField('area_code_id').reset();    
                    }
                }
            },
            {
                xtype : 'hidden',
                name : 'region_id'
            },
            {
                xtype : 'uxListPicker',
                store : Ext.create('App.store.settings.regions.RegionsStore', {pageSize : 80}),
                hideHeaders : true,
                name : 'region',
                fieldLabel : 'Бизнес-подразделение',
                emptyText : 'Выберите бизнес-подразделение',
                allowBlank : false,
                listWidth : 150,
                listeners : {
                    scope : this,
                    select : function(field, record) {
                        field.setValue(record.get('name'));
                        this.getForm().findField('region_id').setValue(record.get('id'));
                        this.changeRegion(record.get('id'));
                    },
                    change : function(field, value) {
                        if (Ext.isEmpty(value)) {
                            this.getForm().findField('region_id').reset();
                            this.changeRegion(null);   
                        }
                    }
                }
            },
            {
                xtype : 'hidden',
                name  : 'city_id'
            },
            {
                xtype : 'uxListPicker',
                store : Ext.create('App.store.settings.regions.CitiesStore', {pageSize : 80}),
                hideHeaders : true,
                name : 'city',
                fieldLabel : 'Город',
                emptyText : 'Выберите город',
                disabled : true,
                listWidth : 150,
                listeners : {
                    scope : this,
                    select : function(field, record){
                        field.setValue(record.get('name'));
                        this.getForm().findField('city_id').setValue(record.get('id'));
                        this.changeCity(record.get('id'));
                    },
                    change : function(field, value) {
                        if (Ext.isEmpty(value)) {
                            this.getForm().findField('city_id').reset();
                            this.changeCity(null);   
                        }
                    }
                }
            },
            {
                xtype : 'hidden',
                name : 'warehouse_id'
            },
            {
                xtype : 'uxListPicker',
                store : Ext.create("App.store.operations.directories.WarehousesStore"),
                columns : [
                    {
                        dataIndex: "code",
                        width: 80,
                        align: "center"
                    }, 
                    {
                        dataIndex : 'name',
                        flex: 1
                    }    
                ],
                hideHeaders : true,
                name : 'warehouse',
                fieldLabel : 'Склад',
                emptyText : 'Выберите склад',
                disabled : true,
                listWidth : 150,
                listeners : {
                    scope : this,
                    select : function(field, record){
                        field.setValue([record.get('code'), record.get('name')].join(', '));
                        this.getForm().findField('warehouse_id').setValue(record.get('id'));   
                    },
                    change : function(field, value){
                        if (Ext.isEmpty(value)) {
                            this.getForm().findField('warehouse_id').reset(); 
                        } 
                    }
                }
            },
            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                padding : '18 0 0 0',
                items : [
                    {
                        xtype : 'label',
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        padding : 8,
                        width : 140,
                        text : 'Регистрация',
                        scope : this,
                        handler : function(){
                            this.fireEvent('submitbtnclick', this);
                        }
                    },
                    {
                        xtype : 'label',
                        flex : 1
                    }
                ]
            }
        ];
    },
    
    changeRegion : function(regionId) {
        var cityField = this.getForm().findField('city'),
            warehouseField = this.getForm().findField('warehouse');
        
        cityField.reset();
        warehouseField.reset();
        
        cityField.setDisabled(true);  
        warehouseField.setDisabled(true);
        
        cityField.getStore().removeFilter('query');
        warehouseField.getStore().removeFilter('query');
            
        if (regionId) {
            cityField.setDisabled(false);
            cityField.getStore().setFilter('region_id', regionId);
        }
    },
    
    changeCity : function(cityId){
        var warehouseField = this.getForm().findField('warehouse');

        warehouseField.reset();

        warehouseField.getStore().removeFilter('query');
            
        if (cityId) {
            warehouseField.getStore().setFilter('city_id', cityId);
        }
        
        warehouseField.setDisabled(!cityId);
    }
    
});