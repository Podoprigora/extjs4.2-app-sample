Ext.define("App.view.plan.planograms.EquipmentChoiceWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanogramEquipmentChoiceWindow",
    id : 'PlanogramEquipmentChoiceWindow',
    
    title: "Добавить оборудование",
    width: 450,
    height: 165,
    
    config : {
        equipmentRecord : null
    },
    
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
            defaults : {
                labelWidth : 120,
                anchor : '100%'
            },
            items: [
                {
                    xtype: "hidden",
                    name: "equipment_id"
                },
                {
                    xtype: "PlanEquipmentsListField",
                    name: "equipment_name",
                    fieldLabel: "Оборудование",
                
                    allowBlank: false,
                    listeners: {
                        scope: this,
                        select: function (field, record) {
                            var form = field.up('form');
                            
                            this.setEquipmentRecord(record);

                            field.setValue(record.get("name"));
                            form.getForm().findField("equipment_id").setValue(record.get("id"));
                            form.getForm().findField('start_pusher').setValue(record.get('start_index'));
                            
                        },
                        clearfield: function (field) {
                            var form = field.up('form');
                            form.getForm().reset();
                            
                            this.setEquipmentRecord(null);
                        }
                    }
                },
                {
                    xtype : 'fieldcontainer',
                    layout : 'hbox',
                    defaults : {
                        labelWidth : 120
                    },
                    items : [
                        {
                            xtype  :'numberfield',
                            name : 'start_pusher',
                            fieldLabel : 'Начальный индекс',
                            allowBlank : false,
                            width : 200,
                            minValue : 0
                        }
                    ]
                }
            ],
            buttons: [
                {
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
                }
            ]
        }
    },
    
    onResetForm: function (win) {
        var basicForm = win.down("form").getForm();
        basicForm.reset();
        
        this.setEquipmentRecord(null);
    },
    
    onCancelBtnClick: function () {
        this.hide();
    }
    
});