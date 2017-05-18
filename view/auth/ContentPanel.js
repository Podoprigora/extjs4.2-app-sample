Ext.define('App.view.auth.ContentPanel', {
    extend : 'Ext.container.Container',
    xtype  : 'AuthContentPanel',
    
    layout : {
        type : 'vbox',
        align : 'stretch'
    },
    
    cls : 'auth-container',
    
    initComponent : function() {
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
    },
    
    buildItems : function() {
        return [
            {
                xtype : 'container',
                padding : 15,
                html : "<div class='company-logo'>&nbsp;</div>",
                height : 60
            },
            {
                xtype : 'panel',
                layout : {
                    type : 'vbox',
                    align : 'center',
                    pack : 'center'
                },
                cls : 'auth-container-body',
                border : false,
                flex : 1,
                items : [
                    {
                        xtype : 'panel',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        width : 400,
                        minHeight : 150,
                        autoHeight : true,
                        cls : 'auth-forms-container',
                        //padding : 2,
                        defaults : {
                            border : false
                        },
                        items : [
                            {
                                xtype : 'panel',
                                layout : {
                                    type : 'hbox',
                                    align : 'stretch'
                                },
                                height : 45,
                                cls : 'auth-form-tabs',
                                defaults : {
                                    xtype : 'button',
                                    enableToggle : true,
                                    toggleGroup : 'authForm',
                                    flex : 1,
                                    listeners : {
                                        click : function(btn) {
                                            if (! btn.pressed) {
                                                btn.toggle(true);
                                            }  
                                        }
                                    }
                                },
                                
                                items : [
                                    {
                                        text : 'Войти в систему',
                                        itemId : 'tab0',
                                        pressed : true,
                                        scope : this,
                                        handler : function(){
                                            this.changeActiveForm(0);
                                        }
                                    },
                                    {
                                        text : 'Зарегистрироваться',
                                        itemId : 'tab1',
                                        scope : this,
                                        handler : function(){
                                            this.changeActiveForm(1);
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'panel',
                                layout : 'card',
                                itemId : 'cardPanel',
                                flex : 1,
                                activeItem : 0,
                                defaults : {
                                    border : false
                                },
                                items : [
                                    {
                                        xtype : 'LoginForm'
                                    },
                                    {
                                        xtype : 'RegisterForm'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];
    },
    
    changeActiveForm : function(index){
        var cardPanel = this.down('#cardPanel');
        cardPanel.getLayout().setActiveItem(index);
    },
    
    changeActiveItem : function(index){
        this.down('#tab' + index).toggle(true);
        this.changeActiveForm(index);
    }
    
});