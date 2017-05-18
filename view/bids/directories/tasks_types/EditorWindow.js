Ext.define("App.view.bids.directories.tasks_types.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectoryTasksTypeEditorWindow",
    id: "BidsDirectoryTasksTypeEditorWindow",
    
    title: "Добавить тип задачи",
    width: 450,
    height: 160,
    
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
            items: [
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name",
                    anchor: "100%",
                    allowBlank: false  
                },
                {
                    xtype: "numberfield",
                    fieldLabel: "Порядок",
                    name: "position",
                    width : 160
                }
            ],
            buttons: [
                {
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
                }
            ]
        };
    },
    
    onBeforeHideWindow: function (win) {
        win.down("form").getForm().reset();
    },
    
    onShowWindow: function (win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
});