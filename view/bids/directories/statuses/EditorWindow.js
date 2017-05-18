Ext.define("App.view.bids.directories.statuses.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryStatusEditorWindow",
    id : 'BidsDirectoryStatusEditorWindow',
    
    width : 500,
    minHeight : 320,
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
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'numberfield',
                    name : 'position',
                    fieldLabel : 'Порядок',
                    allowBlank : false,
                    minValue : 1,
                    value : 1,
                    width : 160
                },
                {
                    xtype : 'checkboxfield',
                    name : 'is_hidden',
                    fieldLabel : 'Скрыть'
                },
                {
                    xtype : 'BidsDirectoryRolesEditorGridPanel',
                    itemId : 'rolesGrid',
                    ui : 'in-form',
                    title : 'Доступно для ролей',
                    autoHeight : true,
                    minHeight : 130,
                    maxHeight : 180
                },
                {
                    xtype : 'BidDirectoryStatusAccessRightsEditorGridPanel',
                    itemId : 'accessRightsGrid',
                    ui : 'in-form',
                    title : 'Права доступа',
                    autoHeight : true,
                    minHeight : 160,
                    margin : '5 0 0 0'
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
    },
    
    onShowWindow : function(win) {
        win.down('form').getForm().findField('name').focus(false, 200);   
    }
});