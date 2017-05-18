Ext.define("App.view.settings.regions.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryRegionEditorWindow",
    id : 'DirectoryRegionEditorWindow',
    
    title: "Добавить регион",
    width: 550,
    minHeight: 550,
    autoHeight : true,
    
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
            defaults: {
                anchor: "100%",
                allowBlank: false
            },
            items: [
                {
                    xtype : 'hidden',
                    name : 'id'
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name"
                },
                {
                    xtype: "uxCombo",
                    name: "time_zone_id",
                    fieldLabel: "Временная зона",
                    store: Ext.create("App.store.settings.regions.TimeZonesStore"),
                    editable: false
                },
                {
                    xtype : 'checkboxfield',
                    boxLabel : 'Временная зона сервера',
                    name : 'is_server_time_zone',
                    inputValue : 1,
                    margin : '0 0 10 105'
                },
                {
                    xtype : 'textarea',
                    name : 'customer_legal_name',
                    fieldLabel : 'Юрлицо заказчика работ',
                    height : 60,
                    allowBlank : true
                },
                {
                    xtype : 'textarea',
                    name : 'performer_legal_name',
                    fieldLabel : 'Юрлицо исполнителя работ',
                    height : 60,
                    allowBlank : true
                },
                {
                    xtype: "ImagesEditorPanel",
                    title : 'Изображение обложки при авторизации',
                    itemId: "imagesPanel",
                    iconCls : 'icon-file-image',
                    uploadUrl : Settings.urls.getUrl('settings.regions.upload_image'),
                    previewUrl : Settings.urls.getUrl('settings.regions.preview_image'),
                    itemWidth : 200,
                    itemHeight : 200,
                    fullSizeView : true,
                    multiple : false,
                    ui: "in-form",
                    margin: "10 0 0 0",
                    autoHeight: true,
                    minHeight : 100
                }
            ],
            
            buttons: [{
                text: "Сохранить",
                iconCls: "icon-save",
                scope: this,
                handler: function () {
                    this.fireEvent("savebtnclick", this);
                }
            },
            {
                text: "Сохранить и закрыть",
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
            }]
        }
    },
    
    onBeforeHideWindow: function (win) {
        win.down("form").getForm().reset();
    },
    
    onCancelBtnClick: function () {
        this.hide();
    },
    
    onShowWindow: function (win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    }
});