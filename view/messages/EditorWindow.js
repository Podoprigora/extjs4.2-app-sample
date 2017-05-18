Ext.define("App.view.messages.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.MessageEditorWindow",
    id: "MessageEditorWindow",
    
    title: "Новое сообщение",
    width: 550,
    autoHeight: true,
    resizable: false,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        this.buttons = this.buildButtons();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
        
        this.on("beforehide", this.onBeforeHideWindow, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            defaults: {
                anchor: "100%"
            },
            items: [
                {
                    xtype: "hidden",
                    name: "recipient_id"
                },
                {
                    xtype: "RecipientsListField",
                    name: "recipient",
                    fieldLabel: "Получатель",
                    emptyText: "Выберите получателя",
                    allowBlank: false,
                    listeners: {
                        scope: this,
                        select: function (field, record) {
                            field.setValue(record.get("fio"));
                            field.previousSibling("hidden[name=recipient_id]").setValue(record.get("id"));
                        }
                    }
                },
                {
                    xtype: "textarea",
                    name: "message",
                    fieldLabel: "Сообщение",
                    emptyText: "Введите сообщение",
                    labelAlign: "top",
                    height: 150,
                    allowBlank: false
                },
                {
                    xtype: "FilesEditorGridPanel",
                    uploadUrl : Settings.urls.getUrl('messages.files.upload'),
                    downloadUrl : Settings.urls.getUrl('messages.files.download'),
                    height: 150,
                    title: "Файлы",
                    ui: "in-form",
                    border: false
                }
            ]
        };
    },
    
    buildButtons: function () {
        return [
            {
                text: "Сохранить",
                iconCls: "icon-save",
                scope: this,
                handler: function () {
                    this.fireEvent("savebtnclick", this);
                }
            }, 
            {
                text: "Отмена",
                scope: this,
                handler: function () {
                    this.hide();
                }
            }
        ];
    },
    
    onBeforeHideWindow: function (win) {
        var form = win.down("form");
        form.getForm().reset();
        win.down("grid").getStore().removeAll(false);
    }
});