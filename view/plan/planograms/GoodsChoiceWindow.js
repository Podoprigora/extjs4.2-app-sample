Ext.define("App.view.plan.planograms.GoodsChoiceWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanogramGoodsChoiceWindow",
    id : 'PlanogramGoodsChoiceWindow',
    
    title: "Добавить товар",
    width: 450,
    height: 165,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        
        this.callParent(arguments);
        
        this.addEvents("addbtnclick");
        
        this.on("beforehide", this.onResetForm, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            items: [{
                xtype: "numberfield",
                fieldLabel: "Ячейка",
                name: "pusher",
                width: 180,
                allowBlank: false,
                minValue: 0
            },
            {
                xtype: "hidden",
                name: "goods_id"
            },
            {
                xtype: "hidden",
                name: "goods_image"
            },
            {
                xtype: "PlanGoodsListField",
                name: "goods_name",
                fieldLabel: "Товар",
                anchor: "100%",
                allowBlank: false,
                listeners: {
                    scope: this,
                    select: function (field, record) {
                        field.setValue(record.get("name"));
                        var basicForm = field.up("form").getForm();
                        basicForm.findField("goods_id").setValue(record.get("id"));
                        basicForm.findField("goods_image").setValue(record.get("image_path"));
                    },
                    clearfield: function (field) {
                        field.previousSibling("hidden[name=goods_id]").reset();
                    }
                }
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
        basicForm.findField("goods_name").clean();
        basicForm.findField("pusher").setReadOnly(false);
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
    
});