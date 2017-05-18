Ext.define('App.controller.AuthController', {
    extend: 'Ext.app.Controller',
    
    models : [
        'auth.RegisterModel',
        'auth.LoginModel'
    ],
    
    views : [    
        'auth.LoginForm',
        'auth.RegisterForm',
        'auth.ContentPanel'
    ],
    
    refs : [
        {
            ref : 'ContentPanel',
            selector : 'AuthContentPanel'
        }
    ],
    
    init : function() {
        this.control({
            'AuthContentPanel' : {
                afterrender : this.onInitCoverBg
            },
            'RegisterForm' : {
                'submitbtnclick' : this.onRegister
            },
            'LoginForm' : {
                'loginbtnclick' : this.onLogin,
                'remaindpasswordbtnclick' : this.onRemaindPassword
            }
        });
    },
    
    onInitCoverBg : function(panel){
        var setRegionCoverImage = function(bgImage){
            var panelEl = panel.getEl().dom;
            
            panelEl.style.background = Ext.String.format("#90A4AE url(/upload_files/auth/{0}) 50% 50% no-repeat", bgImage || 'default-bg.jpg');
            panelEl.style.backgroundSize = 'cover'; 
        };
        
        if ('localStorage' in window){
            setRegionCoverImage(localStorage.getItem('region-cover-image')); 
        }
    },
    
    onLogin : function(form) {
        var model = Ext.create('App.model.auth.LoginModel'),
            basicForm = form.getForm(),
            me = this;
        
        if (basicForm.isValid()) {
            model.set(basicForm.getValues());

            App.ux.Msg.wait('Авторизация ...');
            
            model.save({
                success : function(record, operation) {
                    window.location.href = "";
                },
                failure : function(record, operation){
                    basicForm.markInvalid(operation.request.scope.reader.jsonData['errors']);
                    App.ux.Msg.hide(); 
                }
            });
        }
    },
    
    onRegister : function(form) {
        var model = Ext.create('App.model.auth.RegisterModel'),
            basicForm = form.getForm(),
            me = this;
        
        if (basicForm.isValid()) {
            model.set(basicForm.getFieldValues());
            
            if (Ext.isEmpty(model.get('region'))) {
                model.set('region_id', 0);
            }
            if (Ext.isEmpty(model.get('city'))) {
                model.set('city_id', 0);
            }
            if (Ext.isEmpty(model.get('warehouse'))) {
                model.set('warehouse_id', 0);
            }
            
            App.ux.Msg.wait('Регистрация нового пользователя...');
            
            model.save({
                success : function(record, operation){
                    basicForm.reset();
                    me.getContentPanel().changeActiveItem(0);
                    App.ux.Msg.info(operation.request.scope.reader.jsonData['message']);
                },
                failure : function(record, operation) {
                    basicForm.markInvalid(operation.request.scope.reader.jsonData['errors']); 
                    App.ux.Msg.hide();
                }
            }, this);
        }
    },
    
    onRemaindPassword : function(form) {
        var emailField = form.getForm().findField('auth_login');
        if (emailField.isValid()) {
            App.ux.Msg.wait('Восстановление пароля ...');
            Ext.Ajax.request({
                url : Settings.urls.getUrl('account.remaind_password'),
                params : {
                    email : emailField.getValue()
                },
                success : function(response) {
                    if (App.ux.util.Response.isValidStatus(response)) {
                        App.ux.Msg.info("Пароль отправлен на указанный email.");   
                    } else {
                        var response = Ext.decode(response.responseText);
                        App.ux.Msg.alert(response.message);
                    }   
                },
                failure : function(){
                    App.ux.Msg.alert('Ошибка подключения к серверу!');    
                }
            });
        } else {
            App.ux.Msg.alert('Введите ваш e-mail!');
        }
    }
});
