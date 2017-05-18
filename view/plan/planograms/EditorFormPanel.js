Ext.define("App.view.plan.planograms.EditorFormPanel", {
    extend : "Ext.form.Panel",
    alias : "widget.PlanogramEditorFormPanel",
    
    config: {
        planogramId: null
    },
    
    layout: {
        type: "vbox",
        align: "stretch"
    },
    bodyPadding: 5,
    bodyCls : 'x-container-body',
    
    initComponent: function () {
        this.items = this.buildItems();
        this.tbar = this.buildButtons();

        this.callParent(arguments);
        this.addEvents("savebtnclick", "cancelbtnclick", "addequipmentbtnclick", "selectequipment")
    },
    
    buildItems: function () {
        return [
            {
                bodyPadding: 10,
                border: false,
                layout : 'hbox',
                bodyCls : 'x-container-body',
                items: [
                    {
                        xtype: "hidden",
                        name: "id"
                    },
                    {
                        xtype: "textfield",
                        fieldLabel: "Наименование",
                        name: "name",
                        width: 550,
                        allowBlank: false
                    },
                    {
                        xtype  :'button',
                        text : 'Добавить оборудование',
                        iconCls : 'icon-create',
                        margin : '0 0 0 15',
                        scope : this,
                        handler : function() {
                            this.fireEvent('addequipmentbtnclick', this);
                        }
                    }
                ]
            }, 
            {
                xtype : 'tabpanel',
                itemId : 'equipmentsTabPanel',
                hidden : true,
                plan : true,
                minTabWidth : 120,
                flex: 1
            }
        ]
    },
    
    buildButtons : function() {
        return [
            {
                text : 'Сохранить и создать',
                iconCls : 'icon-save',
                tooltip : 'Сохранение и очистка формы для добавления новой записи',
                scope : this,
                handler : function() {
                    this.fireEvent('savebtnclick', this);
                }
            },
            {
                text : 'Сохранить и закрыть',
                iconCls : 'icon-save-close',
                scope : this,
                handler : function() {
                    this.fireEvent('savebtnclick', this, 'close');
                }
            },
            {
                text : 'Отмена',
                scope : this,
                handler : function() {
                    this.fireEvent('cancelbtnclick', this)
                }
            }
        ];
    }
    
});