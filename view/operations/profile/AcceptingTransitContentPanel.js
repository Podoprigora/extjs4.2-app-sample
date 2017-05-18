Ext.define("App.view.operations.profile.AcceptingTransitContentPanel", {
    extend : "App.view.operations.profile.BasicContentPanel",
    alias : "widget.OperationAcceptingTransitProfileContentPanel",
    
    readOnly: true,
    
    initComponent: function () {
        this.callParent(arguments);
        this.addEvents("acceptbtnclick", "cancelbtnclick");
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            border: false,
            height: 120,
            bodyCls : 'x-container-body',
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
                        defaults: {
                            readOnly: true
                        },
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
                items: [
                    {
                        xtype: "fieldset",
                        title: "Отправитель",
                        defaults: {
                            anchor: "100%",
                            readOnly: true
                        },
                        items: [
                            {
                                xtype: "hidden",
                                name: "warehouse_id"
                            },
                            {
                                xtype: "textfield",
                                name: "warehouse_full_name",
                                fieldLabel: "Склад",
                                readOnly: true
                            },
                            {
                                xtype: "textfield",
                                fieldLabel: "Кладовщик",
                                name: "warehouse_user_full_name",
                                readOnly: true
                            }
                        ]
                    },
                    {
                        xtype: "fieldset",
                        title: "Получатель",
                        margin: "0 0 0 25",
                        defaults: {
                            anchor: "100%",
                            readOnly: true
                        },
                        items: [
                            {
                                xtype: "hidden",
                                name: "transit_warehouse_id"
                            },
                            {
                                xtype: "textfield",
                                name: "transit_warehouse_full_name",
                                fieldLabel: "Склад"
                            },
                            {
                                xtype: "textfield",
                                fieldLabel: "Кладовщик",
                                name: "transit_warehouse_user_full_name"
                            }
                        ]
                    }
                ]
            }]
        };
    },
    
    buildTbar : function() {
        return {
            xtype : 'toolbar',
            dock : 'top',
            layout : 'hbox',
            defaults : {
                flex : 1
            },
            items : [
                {
                    xtype : 'container'
                },
                {
                    xtype : 'buttongroup',
                    minWidth : App.Properties.get('minViewWidth'),
                    items : [
                        {
                            text: "Принять",
                            itemId: "btnAccept",
                            iconCls: "icon-accept",
                            scope: this,
                            handler: function () {
                                this.fireEvent("acceptbtnclick", this);
                            }
                        },
                        {
                            xtype : 'tbspacer',
                            width : 5
                        },
                        {
                            text: "Отмена",
                            scope: this,
                            handler: function () {
                                this.fireEvent("cancelbtnclick", this);
                            }
                        }
                    ]
                },
                {   
                    xtype : 'container'
                }
            ]
        };
    }
});