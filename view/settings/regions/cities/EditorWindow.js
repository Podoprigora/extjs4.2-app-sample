Ext.define("App.view.settings.regions.cities.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryCityEditorWindow",
    id : 'DirectoryCityEditorWindow',
    
    title: "Добавить город",
    width: 450,
    height: 185,
    
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
                    xtype: "textfield",
                    fieldLabel: "Код",
                    name: "code",
                    width : 250,
                    anchor : false
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name"
                },
                {
                    xtype: "uxCombo",
                    name: "region_id",
                    fieldLabel: "Регион",
                    store: Ext.create("App.store.settings.regions.RegionsStore"),
                    editable: false,
                    readOnly: true
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
        win.down("form").getForm().findField("code").focus(false, 200);
    }
});