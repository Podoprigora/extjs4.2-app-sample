Ext.define("App.view.plan.equipments.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanEquipmentEditorWindow",
    id : 'PlanEquipmentEditorWindow',
    
    title : 'Добавить оборудование',
    
    width: 500,
    height: 260,
    autoHeight : true,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick");
        
        this.on("beforehide", this.onResetForm, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            defaults: {
                labelWidth: 140
            },
            items: [
                {
                    xtype : 'hidden',
                    name : 'id'
                },
                {
                    xtype: "textfield",
                    fieldLabel: "Наименование",
                    name: "name",
                    allowBlank: false,
                    anchor: "100%"
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        flex : 1,
                        labelWidth: 140,
                        minValue: 1,
                        maxValue : 1000,
                        allowBlank: false    
                    },
                    items : [
                        {
                            xtype: "numberfield",
                            name: "hor_qty",
                            fieldLabel: "Ячеек по горизонтали"
                        },
                        {
                            xtype: "numberfield",
                            name: "ver_qty",
                            fieldLabel: "Ячеек по вертикали",
                            labelAlign : 'right'
                        }       
                    ]
                },
                {
                    xtype : 'combo',
                    name : 'start_index',
                    fieldLabel : 'Начальный индекс',
                    store : [0, 1],
                    editable : false,
                    width : 230,
                    value : 1
                },
                {
                    xtype : 'textarea',
                    name : 'ad_indexes',
                    fieldLabel : 'Вставка',
                    emptyText : 'Введите индексы ячеек через запятую',
                    anchor : '100%',
                    height : 60
                }
            ],
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
    
    onResetForm: function(win) {
        win = win || this;
        win.down("form").getForm().reset();
        win.down("form").el.unmask();
    },
    
    onShowWindow: function(win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    },
    
    onCancelBtnClick: function() {
        this.hide();
    }
    
});