Ext.define("App.view.settings.roles.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.RoleEditorWindow",
    id : 'RoleEditorWindow',
    
    title : 'Добавить роль',
    width : 430,
    height : 290,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
        this.on("beforehide", this.onBeforeHideWindow, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            defaults : {
                anchor : '100%'
            },
            items : [
                {
                    xtype : 'hidden',
                    name : 'id'
                },
                {
                    xtype : 'textfield',
                    fieldLabel : 'Наименование',
                    name : 'name',
                    allowBlank : false
                },
                {
                    xtype : 'fieldcontainer',
                    fieldLabel : 'Группа',
                    margin : '15 0 5 0',
                    defaults : {
                        name : 'group'
                    },
                    items : [
                        {
                            xtype : 'radiofield',
                            boxLabel : 'Заказчик',
                            inputValue : 'CS',
                            checked : true
                        },
                        {
                            xtype : 'radiofield',
                            boxLabel : 'Исполнитель',
                            inputValue : 'PR'
                        },
                        {
                            xtype : 'radiofield',
                            boxLabel : 'Без группы',
                            inputValue : 'NO'
                        } 
                    ]
                },
                {
                    xtype : 'checkboxfield',
                    name : 'mobile_access',
                    fieldLabel : '&nbsp;',
                    labelSeparator : ' ',
                    boxLabel : 'Доступ из мобильного приложения'
                },
                {
                    xtype : 'checkboxfield',
                    name : 'is_hidden',
                    fieldLabel : '&nbsp;',
                    labelSeparator : ' ',
                    boxLabel : 'Скрывать при регистрации пользователя'
                }
            ],
            buttons: [
                {
                    text: "Сохранить и создать",
                    iconCls: "icon-save",
                    scope: this,
                    handler: function () {
                        this.fireEvent("savebtnclick", this);
                    }
                },
                {
                    text: "Сохранить и закрыть",
                    iconCls: "icon-save-close",
                    scope: this,
                    handler: function () {
                        this.fireEvent("savebtnclick", this, "close");
                    }
                },
                {
                    text: "Отмена",
                    scope: this,
                    handler: this.onCancelBtnClick
                }
            ]
        };
    },
    
    onBeforeHideWindow: function (win) {
        win.down("form").getForm().reset();
    },
    
    onCancelBtnClick: function () {
        this.hide();
    },
    
    onShowWindow: function (win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    }
    
});