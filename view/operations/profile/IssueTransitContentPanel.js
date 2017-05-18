Ext.define("App.view.operations.profile.IssueTransitContentPanel", {
    extend : "App.view.operations.profile.BasicContentPanel",
    alias : "widget.OperationIssueTransitProfileContentPanel",
    
    initComponent: function () {
        this.callParent(arguments);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            border: false,
            height: 120,
            bodyCls : 'x-container-body',
            defaults : {
                anchor : '100%'
            },
            items: [{
                xtype: "hidden",
                name: "id"
            },
            {
                xtype: "hidden",
                name: "type"
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                defaults : {
                    flex : 1
                },
                margin : '0 0 10 0',
                items : [
                    {
                        xtype: "fieldcontainer",
                        layout: "hbox",
                        items: [{
                            xtype: "datefield",
                            fieldLabel: "Дата",
                            name: "date",
                            allowBlank: false,
                            width: 210,
                            tabIndex: 10
                        },
                        {
                            xtype: "timefield",
                            name: "time",
                            width: 70,
                            margin: "0 0 0 5",
                            format: "H:i",
                            tabIndex: 11
                        },
                        {
                            xtype: "textfield",
                            name: "code",
                            fieldLabel: "Код",
                            labelAlign: "right",
                            emptyText: "авт.",
                            labelWidth: 50,
                            flex: 1
                        }]
                    },
                    {
                        xtype : 'container',
                        margin: "0 0 0 25"
                    }
                ]
            },
            {
                xtype: "container",
                layout: {
                    type: "hbox",
                    align: "stretch"
                },
                defaults : {
                    flex : 1
                },
                items: [{
                    xtype: "fieldset",
                    title: "Получатель",
                    defaults: {
                        anchor: "100%",
                        readOnly: this.readOnly
                    },
                    items: [{
                        xtype: "hidden",
                        name: "transit_warehouse_id"
                    },
                    {
                        xtype: "WarehousesListField",
                        name: "transit_warehouse_full_name",
                        fieldLabel: "Склад",
                        emptyText: "Выберите склад",
                        editable: true,
                        allowBlank: false,
                        tabIndex: 12,
                        listeners: {
                            scope: this,
                            select: function (field, record) {
                                field.setValue(record.get("full_name"));
                                var basicForm = field.up("form").getForm();
                                basicForm.findField("transit_warehouse_id").setValue(record.get("id"));
                                basicForm.findField("transit_warehouse_user_full_name").setValue(record.get("user_full_name"));
                            },
                            clearfield: function (field) {
                                var basicForm = field.up("form").getForm();
                                basicForm.findField("transit_warehouse_id").reset();
                                basicForm.findField("transit_warehouse_user_full_name").reset();
                            }
                        }
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "Кладовщик",
                        name: "transit_warehouse_user_full_name",
                        readOnly: true
                    }]
                },
                {
                    xtype: "fieldset",
                    title: "Отправитель",
                    margin: "0 0 0 25",
                    defaults: {
                        anchor: "100%",
                        readOnly: this.readOnly
                    },
                    items: this.buildWarehouseField()
                }]
            }]
        }
    },
    
    buildMaterialsGrid: function () {
        return {
            title: "Материалы",
            xtype: "OperationIssueMaterialsEditorGridPanel",
            itemId: "materialsGrid",
            ui: "in-form",
            autoHeight: true,
            readOnly: this.readOnly,
            minHeight: 150
        }
    }
});