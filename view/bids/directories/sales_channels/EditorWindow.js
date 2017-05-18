Ext.define("App.view.bids.directories.sales_channels.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.BidsDirectorySalesChannelEditorWindow",
    id: "BidsDirectorySalesChannelEditorWindow",
    
    title: "Добавить канал сбыта",
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
            defaults : {
                anchor: "100%",
                allowBlank: false    
            },
            items: [
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name"
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Код в базе",
                    name: "code"
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