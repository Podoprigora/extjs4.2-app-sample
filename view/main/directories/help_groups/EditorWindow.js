Ext.define("App.view.main.directories.help_groups.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MainDirectoryHelpGroupEditorWindow",
    id : 'MainDirectoryHelpGroupEditorWindow',
    
    title : 'Добавить группу',
    width : 450,
    height : 160,    
    
    initComponent : function(){
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.on("beforehide", this.onResetForm, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildItems : function(){
        return {
            xtype : 'form',
            bodyPadding : 15,
            bodyCls : 'x-container-body',
            items : [
                {
                    xtype : 'hiddenfield',
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
                    fieldLabel : 'Порядок',
                    name : 'priority',
                    width : 180
                }
            ],
            buttons: [
                {
                    text: "Сохранить и создать",
                    iconCls: "icon-save",
                    scope: this,
                    handler: function () {
                        this.fireEvent("savebtnclick", this, "create");
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
    
    onResetForm : function(){
        this.down('form').getForm().reset();
    },
    
    onShowWindow: function(win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    },
    
    onCancelBtnClick: function() {
        this.hide();
    }
    
});