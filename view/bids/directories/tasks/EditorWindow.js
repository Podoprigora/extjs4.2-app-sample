Ext.define("App.view.bids.directories.tasks.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryTasksEditorWindow",
    id : 'BidsDirectoryTasksEditorWindow',
    
    width : 600,
    minHeight : 510,
    autoHeight : true,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents('savebtnclick');
        
        this.on('beforehide', this.onBeforeHideWindow, this);
        this.on('show', this.onShowWindow, this);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'hidden',
                    name : 'id'
                },
                {
                    xtype : 'hidden',
                    name : 'parent_id'
                },
                {
                    xtype : 'textfield',
                    name : 'parent_name',
                    fieldLabel : 'Группа',
                    readOnly : true,
                    anchor : '100%'
                },
                {
                    xtype : 'textfield',
                    name : 'name',
                    fieldLabel : 'Наименование',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'textarea',
                    name : 'desc',
                    fieldLabel : 'Описание',
                    height : 50,
                    anchor : '100%'
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        flex : 1
                    },
                    items : [
                        {
                            xtype : 'uxCombo',
                            name : 'type_id',
                            fieldLabel : 'Тип',
                            store : Ext.create('App.store.bids.directories.TasksTypesStore'),
                            editable : false,
                            enableReset : true
                        },
                        {
                            xtype : 'numberfield',
                            name : 'cat_or_zone_num',
                            fieldLabel : 'Категория / Зона',
                            labelAlign : 'right',
                            labelWidth : 150
                        }
                    ]
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        minValue : 0,
                        hideTrigger : true,
                        labelWidth : 150,
                        flex : 1
                    },
                    items : [
                        {
                            xtype : 'numberfield',
                            name : 'customer_price',
                            fieldLabel : 'Стоимость заказчика'
                        },
                        {
                            xtype : 'numberfield',
                            name : 'performer_price',
                            fieldLabel : 'Стоимость исполнителя',
                            labelAlign : 'right'
                        }  
                    ]
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        minValue : 0,
                        labelWidth : 150,
                        flex : 1
                    },
                    items : [
                        {
                            xtype : 'numberfield',
                            name : 'peoples_qty',
                            fieldLabel : 'Норматив кол-во людей'
                        },
                        {
                            xtype : 'numberfield',
                            name : 'minutes_qty',
                            fieldLabel : 'Норматив кол-во минут',
                            labelAlign : 'right'
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
                            xtype : 'checkboxfield',
                            name : 'need_equipment',
                            fieldLabel : 'Требуется указать оборудование в каталоге',
                            labelWidth : 240,
                            listeners : {
                                scope : this,
                                change : this.onChangeNewEquipmentField
                            }
                        },
                        {
                            xtype : 'checkboxfield',
                            name : 'require_accounting_culc',
                            fieldLabel : 'Учитывать бухгалтерское оформление',
                            disabled : true,
                            labelWidth : 225,
                            margin : { left : 15 }
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
                            xtype : 'checkboxfield',
                            name : 'visible_for_ordering',
                            fieldLabel : 'Доступно при заказе',
                            labelWidth : 240,
                            checked : true
                        },
                        {
                            xtype : 'checkboxfield',
                            name : 'visible_for_performance',
                            fieldLabel : 'Доступно при выполнении',
                            labelWidth : 225,
                            margin : { left : 15 },
                            checked : true
                        }
                    ]
                },
                {
                    xtype : 'checkboxfield',
                    name : 'countable',
                    fieldLabel : 'Исчисляемое',
                    labelWidth : 150
                },
                {
                    xtype : 'checkboxfield',
                    name : 'is_hidden',
                    fieldLabel : 'Скрыть',
                    labelWidth : 150
                },
                {
                    xtype : 'numberfield',
                    name : 'priority',
                    fieldLabel : 'Приоритет',
                    minValue : 0,
                    labelWidth : 150,
                    width : 260
                },
                {
                    xtype : 'BidsDirectoryAreaCodesEditorGridPanel',
                    itemId : 'codesGrid',
                    ui : 'in-form',
                    title : 'Видимость для территорий',
                    autoHeight : true,
                    minHeight : 130,
                    maxHeight : 180
                }
            ],
            buttons : [
                {
                    text : 'Сохранить и создать',
                    iconCls : 'icon-save',
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
                    handler : this.onCancelBtnClick
                }
            ]
        };
    },
    
    onChangeNewEquipmentField : function(field, checked) {
        var nextCheckbox = field.nextSibling('checkboxfield');
        nextCheckbox.reset();
        nextCheckbox.setDisabled(! checked);
    },
    
    onCancelBtnClick : function() {
        this.hide();   
    },
    
    onBeforeHideWindow : function(win) {
        win.down('form').getForm().reset(true);
        win.down('#codesGrid').getStore().removeAll();
    },
    
    onShowWindow : function(win) {
        win.down('form').getForm().findField('name').focus(false, 200);   
    }
});