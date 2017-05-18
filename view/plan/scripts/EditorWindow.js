Ext.define("App.view.plan.scripts.EditorWindow", {
    extend : "App.ux.window.Window",
    alias : "widget.PlanScriptEditorWindow",
    id : 'PlanScriptEditorWindow',
    
    title : 'Добавить скрипт',
    
    width: 700,
    height: 500,
    autoHeight : true,
    
    initComponent: function () {
        this.items = this.buildFormPanel();
        
        this.callParent(arguments);
        
        this.addEvents("savebtnclick", "applyrulebtnclick", "cleanrulebtnclick");
        
        this.on("beforehide", this.onResetForm, this);
        this.on("show", this.onShowWindow, this);
    },
    
    buildFormPanel: function () {
        return {
            xtype: "form",
            bodyPadding: 15,
            bodyCls : 'x-container-body',
            layout : {
                type : 'vbox',
                align : 'stretch'
            },
            items: [
                {
                    layout : 'anchor',
                    bodyCls : 'x-container-body',
                    border : false,
                    height : 158,
                    items : [
                        {
                            xtype : 'hidden',
                            name : 'id'
                        },
                        {
                            xtype: "textfield",
                            fieldLabel: "Наименование",
                            name: "name",
                            allowBlank: false,
                            anchor: "100%",
                            tabIndex : 1
                        },
                        {
                            xtype : 'form',
                            itemId : 'ruleForm',
                            title : 'Правила',
                            anchor : '100%',
                            border : false,
                            bodyCls : 'x-container-body',
                            ui : 'in-form-no-border',
                            items : [
                                {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    defaults : {
                                        allowBlank : false
                                    },
                                    items : [
                                        {
                                            xtype : 'combo',
                                            name : 'trigger',
                                            store : Ext.create('App.store.plan.ScriptRuleTriggersLocalStore'),
                                            displayField : 'name',
                                            valueField : 'value',
                                            fieldLabel : 'Триггер',
                                            editable : true,
                                            queryMode: 'local',
                                            anyMatch : true,
                                            regex : /[PWD0-9]{4}/i,
                                            selectOnFocus : true,
                                            tabIndex : 10,
                                            margin : '0 5 0 0',
                                            flex : 1,
                                            listeners : {
                                                scope : this,
                                                change : function(field, value){
                                                    
                                                    var ruleForm = this.down('#ruleForm').getForm(),
                                                        triggerValueField = ruleForm.findField('trigger_value'),
                                                        triggerDelayField = ruleForm.findField('trigger_delay');
                                                        
                                                    triggerValueField.reset();
                                                    triggerDelayField.reset();
                                                    
                                                    /*if (Ext.isEmpty(value) == false){ 
                                                        if(value.indexOf('P') >= 0) {
                                                            triggerValueField.setMaxValue(1);    
                                                        } else {
                                                            triggerDelayField.setMaxValue(15);   
                                                        }
                                                    }*/
                                                }
                                            }
                                        },
                                        {
                                            xtype : 'numberfield',
                                            name : 'trigger_value',
                                            fieldLabel : 'Значение',
                                            labelAlign : 'right',
                                            width : 150,
                                            labelWidth : 70,
                                            margin : '0 5 0 0',
                                            maxLength : 2,
                                            minValue : 0,
                                            tabIndex : 11
                                        },
                                        {
                                            xtype : 'numberfield',
                                            name : 'trigger_delay',
                                            fieldLabel : 'Задержка',
                                            labelAlign : 'right',
                                            width : 170,
                                            labelWidth : 95,
                                            emptyText : 'сек.',
                                            minValue : 0,
                                            tabIndex : 12
                                        }
                                    ]
                                },
                                {
                                    xtype : 'fieldcontainer',
                                    layout : 'hbox',
                                    defaults : {
                                        allowBlank : false
                                    },
                                    items : [
                                        {
                                            xtype : 'combo',
                                            name : 'action',
                                            store : Ext.create('App.store.plan.ScriptRuleActionsLocalStore'),
                                            displayField : 'name',
                                            valueField : 'value',
                                            fieldLabel : 'Действие',
                                            editable : true,
                                            queryMode: 'local',
                                            anyMatch : true,
                                            regex : /[VA0-9]{4}/i,
                                            selectOnFocus : true,
                                            tabIndex : 13,
                                            margin : '0 5 0 0',
                                            flex : 1,
                                            listeners : {
                                                scope : this,
                                                change : function(field, value){
                                                    
                                                    var ruleForm = this.down('#ruleForm').getForm(),
                                                        actionValueField = ruleForm.findField('action_value'),
                                                        actionDurationField = ruleForm.findField('action_duration');
                                                    
                                                    actionValueField.reset();
                                                    actionDurationField.reset();
                                                }
                                            }
                                        },
                                        {
                                            xtype : 'numberfield',
                                            name : 'action_value',
                                            fieldLabel : 'Значение',
                                            labelAlign : 'right',
                                            width : 150,
                                            labelWidth : 70,
                                            margin : '0 5 0 0',
                                            maxLength : 2,
                                            minValue : 0,
                                            tabIndex : 14
                                        },
                                        {
                                            xtype : 'numberfield',
                                            name : 'action_duration',
                                            fieldLabel : 'Длительность',
                                            labelAlign : 'right',
                                            width : 170,
                                            labelWidth : 95,
                                            emptyText : 'сек.',
                                            minValue : 0,
                                            tabIndex : 15
                                        }
                                    ]
                                
                                },
                                {
                                    xtype : 'container',
                                    layout : 'hbox',
                                    padding : '5 0 10 0',
                                    items : [
                                        { 
                                            xtype : 'label',
                                            flex : 1 
                                        },
                                        {
                                            xtype : 'button',
                                            itemId : 'btnRuleClean',
                                            text : 'Очистить',
                                            margin : '0 5 0 0',
                                            tabIndex : 17,
                                            scope : this,
                                            handler : function(){
                                                this.fireEvent('cleanrulebtnclick', this);     
                                            }
                                        },
                                        {
                                            xtype : 'button',
                                            itemId : 'btnRuleApply',
                                            text : '<b>Добавить / изменить</b>',
                                            tabIndex : 16,
                                            scope : this,
                                            handler : function(){
                                                this.fireEvent('applyrulebtnclick', this);   
                                            }
                                        }
                                    ]
                                }
                            ]
                        },    
                    ]
                },
                {
                    xtype : 'PlanScriptRulesGridPanel',
                    itemId : 'rulesList',
                    flex : 1
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
        win.down("#rulesList").getStore().removeAll();
        win.down("form").el.unmask();
    },
    
    onShowWindow: function(win) {
        win.down("form").getForm().findField("name").focus(false, 200);
    },
    
    onCancelBtnClick: function() {
        this.hide();
    }
    
});