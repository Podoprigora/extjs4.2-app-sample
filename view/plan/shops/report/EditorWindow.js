Ext.define("App.view.plan.shops.report.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanShopReportEditorWindow",
    id : 'PlanShopReportEditorWindow',
    
    title : 'Отчет',
    
    width : 650,
    height : 510,
    
    initComponent : function(){
        
        this.items = this.buildForm();
        
        this.callParent(arguments);
        
        this.addEvents("addbtnclick");
        
        this.on("beforehide", this.onResetForm, this);
    },
    
    buildForm : function() {
        return [
            {
                xtype : 'form',
                bodyPadding : 15,
                bodyCls : 'x-container-body',
                containerScroll : true,
                overflowY : 'auto',
                items : [
                    {
                        xtype : 'hidden',
                        name : 'id'
                    },
                    {
                        xtype : 'datefield',
                        name : 'created',
                        fieldLabel : 'Дата',
                        allowBlank : false,
                        labelWidth : 100,
                        width : 210
                    },
                    {
                        xtype : 'textarea',
                        name : 'comment',
                        fieldLabel : 'Комментарий',
                        labelAlign : 'top',
                        allowBlank : false,
                        anchor : '100%',
                        height : 140
                    },
                    {
                        xtype: "ImagesEditorPanel",
                        uploadUrl : Settings.urls.getUrl('plan.shops.upload_image'),
                        previewUrl : Settings.urls.getUrl('plan.shops.preview_image'),
                        itemId: "imagesPanel",
                        ui: "in-form",
                        margin: "15 0 25 0",
                        autoHeight: true,
                        minHeight : 180,
                        itemWidth : 140,
                        itemHeight : 160
                    }
                ],
                buttons: [
                    {
                        text: "Добавить",
                        iconCls: "icon-create",
                        itemId : 'btnAccept',
                        scope: this,
                        handler: function () {
                            this.fireEvent("addbtnclick", this);
                        }
                    },
                    {
                        text: "Отмена",
                        scope: this,
                        handler: this.onCancelBtnClick
                    }
                ]
            }
        ];    
    },
    
    onResetForm: function (win) {
        var basicForm = win.down("form").getForm();
        basicForm.reset();
        
        this.down('#imagesPanel').getStore().removeAll();
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
    
});