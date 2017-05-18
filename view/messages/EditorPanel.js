Ext.define("App.view.messages.EditorPanel", {
    extend : "Ext.panel.Panel",
    alias : "widget.MessageEditorPanel",
    
    title: "Просмотр / изменение сообщения",
    bodyPadding: 15,
    layout: "anchor",
    autoScroll: true,
    //bodyCls : 'x-container-body',
    defaults: {
        anchor: "100%"
    },
    
    initComponent: function () {
        
        this.items = this.buildItems();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
    },
    
    buildItems: function () {
        return [
            {
                xtype: "MessagesHistoryViewPanel",
                autoHeight: true,
                ui: "in-form",
                //bodyCls : 'x-container-body',
                border: false
            }, 
            {
                xtype: "FilesEditorGridPanel",
                uploadUrl : Settings.urls.getUrl('messages.files.upload'),
                downloadUrl : Settings.urls.getUrl('messages.files.download'),
                minHeight: 105,
                autoHeight: true,
                margin : '10 0 0 0',
                //title: "Файлы",
                ui: "in-form",
                bodyCls : '',
                border: false,
                removeDirty : true
            }, 
            {
                itemId: "newMessageForm",
                xtype: "form",
                //height: 120,
                border: false,
                margin: "6 0 0 0",
                //bodyCls : 'x-container-body',
                defaults: {
                    anchor: "100%"
                },
                items: [
                    {
                        xtype: "hidden",
                        name: "parent_id"
                    },
                    {
                        xtype: "textfield",
                        name: "user",
                        fieldLabel: "Получатель",
                        readOnly: true,
                        margin: "0 0 10 0"
                    },
                    {
                        xtype: "textarea",
                        name: "message",
                        emptyText: "Введите новое сообщение",
                        height: 80,
                        allowBlank: false
                    },
                    {
                        xtype  : 'button',
                        padding : 5,
                        itemId: "btnSave",
                        text: "Отправить сообщение",
                        iconCls : 'icon-comments-green-light',
                        anchor : false,
                        scope: this,
                        handler: function () {
                            this.fireEvent("savebtnclick", this);
                        }
                    }
                ]
            }
        ];
    },
    
    setInactive: function (inactive) {
        var inactive = inactive || false;
        this.down("#newMessageForm").getForm().reset();
        this.down("MessagesHistoryViewPanel").getStore().removeAll(false);
        this.down("FilesEditorGridPanel").getStore().removeAll(false);
        this.setDisabled(inactive);
    }
});