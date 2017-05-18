Ext.define("App.view.maps.transports.directory.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MapsTransportDirectoryEditorWindow",
    id : 'MapsTransportDirectoryEditorWindow',
    
    width : 550,
    minHeight : 388,
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
                    xtype : 'textfield',
                    name : 'name',
                    fieldLabel : 'Наименование',
                    emptyText : 'название машины',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'textfield',
                    name : 'driver',
                    fieldLabel : 'Водитель',
                    emptyText : 'имя водителя/экипажа',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'radiogroup',
                    fieldLabel : 'Тип машины',
                    layout : 'hbox',
                    padding : '10 0 0 0',
                    defaults : {
                        margin : '0 25 0 0'
                    },
                    items : [
                        {
                            boxLabel : 'Грузовой',
                            name : 'type',
                            inputValue : 1, 
                            checked : true
                        },
                        {
                            boxLabel : 'Легковой',   
                            name : 'type',
                            inputValue : 2 
                        }
                    ]
                },
                {
                    xtype: "fieldset",
                    title: "Доступ к сервису сигнализации",
                    border : false,
                    margin : '8 0 0 0',
                    items: [
                        {
                            xtype : 'fieldcontainer',
                            layout : 'hbox',
                            defaults : {
                               flex : 1,
                               allowBlank : false
                            },
                            items : [
                                {
                                    xtype: "textfield",
                                    name: "login",
                                    fieldLabel: "Логин"
                                }, 
                                {
                                    xtype: "textfield",
                                    name: "password",
                                    fieldLabel: "Пароль",
                                    labelAlign : 'right',
                                    labelWidth : 70
                                }
                            ]
                            
                        }
                    ]
                },
                {
                    xtype : 'checkboxfield',
                    name : 'is_hidden',
                    fieldLabel : 'Скрыть'
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
    
    onCancelBtnClick : function() {
        this.hide();   
    },
    
    onBeforeHideWindow : function(win) {
        win.down('form').getForm().reset();
        win.down('#codesGrid').getStore().removeAll();
    },
    
    onShowWindow : function(win) {
        win.down('form').getForm().findField('name').focus(false, 200);   
    }
});