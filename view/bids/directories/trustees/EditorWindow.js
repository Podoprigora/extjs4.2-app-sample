Ext.define("App.view.bids.directories.trustees.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryTrusteeEditorWindow",
    id : 'BidsDirectoryTrusteeEditorWindow',
    
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
                    name : 'fio1',
                    fieldLabel : 'ФИО',
                    emptyText : 'именительный падеж (Иванов Иван Иванович)',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'textfield',
                    name : 'fio2',
                    fieldLabel : 'ФИО',
                    emptyText : 'родительный падеж (Иванова Ивана Ивановича)',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'textfield',
                    name : 'position',
                    fieldLabel : 'Должность',
                    emptyText : 'родительный падеж (регионального менеджера)',
                    allowBlank : false,
                    anchor : '100%'
                },
                {
                    xtype : 'textfield',
                    name : 'basis',
                    fieldLabel : 'Основание',
                    emptyText : 'родительный падеж (Доверенности №32 от 24.01.2005 г.)',
                    allowBlank : false,
                    anchor : '100%'
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
        win.down('form').getForm().findField('fio1').focus(false, 200);   
    }
});