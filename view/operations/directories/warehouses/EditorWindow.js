Ext.define("App.view.operations.directories.warehouses.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.DirectoryWarehouseEditorWindow",
    id : 'DirectoryWarehouseEditorWindow',
    
    title: "Добавить склад",
    width: 450,
    height: 315,
    
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
                    fieldLabel: "Код",
                    name: "code",
                    width: 250,
                    allowBlank: false
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name",
                    anchor: "100%",
                    allowBlank: false
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Внешний ID",
                    name: "outer_id",
                    width: 250
                },
                {
                    xtype: "uxCombo",
                    name: "city_id",
                    fieldLabel: "Город",
                    store: Ext.create("App.store.settings.regions.CitiesStore"),
                    displayField: "name_full",
                    anchor: "100%",
                    allowBlank: false
                },
                {
                    xtype: "numberfield",
                    name: "area",
                    fieldLabel: "Площадь",
                    width: 250
                },
                {
                    xtype: "textarea",
                    fieldLabel: "Адрес",
                    name: "address",
                    anchor: "100%",
                    height: 60
                }
            ],
            
            buttons: [{
               text : 'Сохранить и создать',
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