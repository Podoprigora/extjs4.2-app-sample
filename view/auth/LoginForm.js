Ext.define('App.view.auth.LoginForm',{
    extend : 'Ext.form.Panel',
    xtype : 'LoginForm',
    
    layout : 'anchor',
    bodyPadding : '35 35 15 35',
    bodyCls : 'x-container-body',
    defaults : {
        anchor : '100%',
        labelAlign : 'top',
        labelWidth : 100,
        msgTarget : 'under',
        enableKeyEvents : true
    },
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function(){
        return [
            {
                xtype : 'textfield',
                name : 'auth_login',
                vtype : 'email',
                fieldLabel : 'E-mail / логин',
                emptyText : 'Введите ваш e-mail',
                allowBlank : false,
                listeners : {
                    scope : this,
                    keypress : function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            this.getForm().findField('auth_password').focus(true, 50);
                        }
                    }
                }
            },
            {
                xtype : 'textfield',
                name : 'auth_password',
                inputType : 'password',
                fieldLabel : 'Пароль',
                emptyText : 'Введите ваш пароль',
                allowBlank : false,
                listeners : {
                    scope : this,
                    keypress : function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            this.fireEvent('loginbtnclick', this);
                        }
                    }
                }
            },
            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                margin : '8 0 0 0',
                items : [
                    {
                        xtype : 'checkboxfield',
                        boxLabel : 'Запомнить меня',
                        name : 'remember_me',
                        inputValue : 1
                    },
                    {
                        xtype : 'label',
                        flex : 1
                    },
                    {
                        xtype : 'container',
                        padding : '4 0 0 0',
                        html : '<a href="javaScript:void(0)" id="lk-remaind-password">Забыли пароль?</a>',
                        width : 100,
                        listeners : {
                            scope : this,
                            afterrender : function(){
                                var remaindLink = Ext.fly('lk-remaind-password');
                                remaindLink.on('click', function(e){
                                    this.fireEvent('remaindpasswordbtnclick', this);
                                }, this);
                            }
                        }
                    }
                ]
            },
            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                padding : '25 0 0 0',
                items : [
                    {
                        xtype : 'label',
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        padding : 8,
                        width : 140,
                        text : 'Войти',
                        scope : this,
                        handler : function(){
                            this.fireEvent('loginbtnclick', this);
                        }
                    },
                    {
                        xtype : 'label',
                        flex : 1
                    }
                ]
            }
        ];
    }
});