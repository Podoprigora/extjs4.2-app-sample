Ext.define("App.view.settings.area_codes.UsersEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.AreaCodeUserEditorWindow",
    id : 'AreaCodeUserEditorWindow',
   
    width : 450,
    height : 300,
    resizable : true,
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents('adduser', 'savebtnclick');
    },
    
    buildItems : function() {
        return {
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            defaults : {
                border : false,
                bodyCls : 'x-container-body'
            },
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'form',
                    bodyPadding : 10,
                    height : 45,
                    items : [
                        {
                            xtype : 'UsersListField',
                            emptyText : 'Выберите пользователя',
                            anchor : '100%',
                            listeners : {
                                scope : this,
                                select : function(field, record) {
                                    this.fireEvent('adduser', this, record);
                                }
                            }
                        }
                    ]
                },
                {
                    xtype : 'AreaCodeUsersEditorGrid',
                    itemId : 'usersGrid',
                    flex : 1
                }
            ],
            buttons : [
                {
                    text : 'Сохранить',
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
                        this.hide();
                    }
                }
            ]
        };
    }
});