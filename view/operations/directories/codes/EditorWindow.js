Ext.define("App.view.operations.directories.codes.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryCodeEditorWindow",
    id: "DirectoryCodeEditorWindow",
    
    title: "Добавить код",
    width: 450,
    height: 180,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
        
        this.on("beforehide", this.onBeforeHideWindow, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            items: [{
                xtype: "textfield",
                fieldLabel: "Код",
                name: "code",
                anchor: "100%",
                allowBlank: false
            },
            {
                xtype: "textarea",
                fieldLabel: "Примечание",
                name: "description",
                anchor: "100%",
                height: 40
            }],
            buttons: [{
                text: "Сохранить и создать",
                iconCls: "icon-save",
                scope: this,
                handler: function () {
                    this.fireEvent("savebtnclick", this)
                }
            },
            {
                text: "Сохранить и закрыть",
                iconCls: "icon-save-close",
                scope: this,
                handler: function () {
                    this.fireEvent("savebtnclick", this, "close")
                }
            },
            {
                text: "Отмена",
                scope: this,
                handler: this.onCancelBtnClick
            }]
        };
    },
    
    onBeforeHideWindow: function (win) {
        win.down("form").getForm().reset();
    },
    
    onShowWindow: function (win) {
        win.down("form").getForm().findField("code").focus(false, 200);
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
});