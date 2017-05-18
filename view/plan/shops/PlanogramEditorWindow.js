Ext.define("App.view.plan.shops.PlanogramEditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.ShopPlanogramEditorWindow",
    id : 'ShopPlanogramEditorWindow',
    
    title: "Добавить выкладку",
    width: 550,
    minHeight: 165,
    autoHeight: true,
    
    initComponent: function () {
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents("addbtnclick");
        this.on("beforehide", this.onResetForm, this);
    },
    
    buildForm: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            defaults: {
                allowBlank: false,
                msgTarget: "under"
            },
            items: [{
                xtype: "hidden",
                name: "planogram_id"
            },
            {
                xtype: "PlanogramsListField",
                fieldLabel: "Выкладка",
                name: "planogram_name",
                anchor: "100%",
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        field.setValue(record.get("name"));
                        field.previousSibling("hidden[name=planogram_id]").setValue(record.get("id"));
                    }
                }
            },
            {
                xtype: "datefield",
                name: "start_date",
                fieldLabel: "Дата начала",
                width: 220
            }],
            buttons: [{
                text: "Добавить",
                iconCls: "icon-create",
                scope: this,
                handler: function () {
                    this.fireEvent("addbtnclick", this);
                }
            },
            {
                text: "Отмена",
                scope: this,
                handler: this.onCancelBtnClick
            }]
        }
    },
    
    onResetForm: function (win) {
        var basicForm = win.down("form").getForm();
        basicForm.reset();
        basicForm.findField("planogram_name").clean();
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
});