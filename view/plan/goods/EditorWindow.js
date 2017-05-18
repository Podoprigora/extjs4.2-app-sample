Ext.define("App.view.plan.goods.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanGoodsEditorWindow",
    id : 'PlanGoodsEditorWindow',
    
    title : 'Добавить товар',
    
    width: 450,
    minHeight: 350,
    autoHeight : true,
    resizable : true,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        this.callParent(arguments);
        
        this.addEvents("savebtnclick", "selectfile");
        
        this.on("beforehide", this.onResetForm, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            items: [{
                xtype: "hidden",
                name: "id"
            },
            {
                xtype: "hidden",
                name: "image"
            },
            {
                xtype: "textfield",
                fieldLabel: "Наименование",
                name: "name",
                allowBlank: false,
                anchor: "100%"
            },
            {
                xtype: "form",
                itemId: "uploadForm",
                border: false,
                bodyPadding: "10 0 0 105",
                bodyCls : 'x-container-body',
                items: [{
                    xtype: "filefield",
                    name: "upload_file",
                    buttonOnly: true,
                    buttonConfig: {
                        text: "Выберите изображение"
                    },
                    listeners: {
                        scope: this,
                        change: this.onSelectFile
                    }
                },
                {
                    xtype: "panel",
                    itemId: "previewPanel",
                    border: false,
                    minHeight: 200,
                    autoHeight : true,
                    margin: "10 0 0 0",
                    bodyCls : 'x-container-body',
                    tpl: '<img src="{path}" style="overflow:hidden;">'
                }]
            }],
            buttons: [{
                text: "Сохранить и создать",
                iconCls: "icon-save",
                scope: this,
                handler: function () {
                    this.fireEvent("savebtnclick", this);
                }
            },
            {
                text: "Сохратить и закрыть",
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
    
    onSelectFile: function(field, value) {
        this.fireEvent("selectfile", this, field, value);
    },
    
    onResetForm: function(win) {
        win = win || this;
        win.down("form").getForm().reset();
        win.down("#previewPanel").update({
            path: null
        });
        win.down("form").el.unmask();
    },
    
    onShowWindow: function(win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    },
    
    onCancelBtnClick: function() {
        this.hide();
    }
    
});