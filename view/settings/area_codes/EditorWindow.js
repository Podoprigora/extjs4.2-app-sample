Ext.define("App.view.settings.area_codes.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.AreaCodeEditorWindow",
    widget : 'AreaCodeEditorWindow',
    
    title : 'Добавить код',
    width : 418,
    height : 160,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
        this.on("show", this.onShowWindow, this);
        this.on("beforehide", this.onResetForm, this);
    },
    
    buildForm : function() {
        return {
            xtype : 'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'numberfield',
                    fieldLabel : 'Введите код',
                    name : 'code',
                    allowBlank : false,
                    minLength : 7,
                    maxLength : 7,
                    hideTrigger : true
                },
                {
                    xtype : 'textfield',
                    fieldLabel : 'Код группы',
                    name : 'parent_code',
                    emptyText : 'авт.',
                    readOnly : true
                },
                {
                    xtype : 'hidden',
                    name : 'parent_id'
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
                    text: "Сохратить и закрыть",
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
    
    onShowWindow : function(win) {
        win.down("form").getForm().findField("code").focus(false, 200);
    },
    
    onResetForm: function(win) {
        win = win || this;
        var form = win.down('form');
        form.getForm().reset();
        form.el.unmask();
    },
    
    onCancelBtnClick: function() {
        this.hide();
    }
});